import {ObjectId} from 'mongodb'
import {BSONTypeError} from 'bson'

import * as m from 'bazar-api/app/src/messages.js'

// class InvalidId extends Errors {constructor(...args) {super(...args)}}

const VALIDATION_FAIL_MSG = "data validation failed"
const CONTAINS_ID_MSG = "data contains _id: updating document _id is not allowed"

class InvalidData extends Errors {constructor(message, data, ...args) {super(message, ...args); this.data = data}}

async function storeCreate(fields, {c}) {
    let writeRes = null

    try {
        writeRes = await c.insertOne(fields)
    } catch(e) {
        if (121 === e.code) e = new InvalidData(VALIDATION_FAIL_MSG, e)
        throw e
    }

    return true
}

/**
    @param {id, in Types} id
*/
async function storeUpdate(id, fields, {c}) {
    // see update, storeGetById: whether to validate id
    const idE = validateObjectId(id)
    if (idE) throw m.InvalidCriterion.create(idE.message, idE)

    // see Prohibiting updating `_id`
    if ('_id' in fields) throw new InvalidData(CONTAINS_ID_MSG)

    let res = null
    try {
        res = await c.updateOne({_id: id}, {$set: fields})
    } catch(e) {
        if (121 === e.code) e = new InvalidData(VALIDATION_FAIL_MSG, e)
        throw e
    }

    if (!res.matchedCount) throw m.ResourceNotFound.create("the given id didn't match any products")

    return true
}

async function storeGetById(id, {c, validateObjectId, m}) {
    // see update, storeGetById: whether to validate id
    const idE = validateObjectId(id)
    if (idE) throw m.InvalidCriterion.create(idE.message, idE)

    const res = c.findOne({_id: id})
    return res
}

/**
    @param {fields, in Types} fields
*/
async function create(fields, {create, validate}) {
    try {
        await storeCreate(fields)
    } catch(e) {
        if (!(e instanceof InvalidData)) throw e

        const errors = validate(fields)

        if (!errors) throw new Error("mongodb validation fails while model level validation succeeds")
        throw errors
    }
}

/**
    @param {id, in Types} id
    @param {fields, in Types} fields
*/
async function update(id, fields, {update, validate}) {
    let res = null
    try {
        res = await update(id, fields)
    } catch (e) {
        // 121 is validation error: erroneous response example in https://www.mongodb.com/docs/manual/core/schema-validation/#existing-documents
        if (!(e instanceof InvalidData)) throw e

        if (CONTAINS_ID_MSG === e.message) throw {errors: [], node: {_id: errors: [m.FieldUnknown.create(e.message, e)], node: null}}

        // do additional validation only if builtin validation fails. See mongodb with bsonschema: is additional data validation necessary?
        const doc = await getById(id)

        const errors = validate(Object.assign(doc, fields))

        if (!errors) throw new Error("mongodb validation fails while model level validation succeeds")
        throw errors
    }
}

/**
    @param {id, in Types} id
*/
async function getById() {
    // first, validate id (see update, storeGetById: whether to validate id)
}
