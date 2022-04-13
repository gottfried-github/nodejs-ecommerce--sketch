import * as m from 'bazar-api/app/src/messages.js'

class InvalidId extends Errors {constructor(...args) {super(...args)}}
class InvalidData extends Errors {constructor(...args) {super(...args)}}

async function storeCreate(fields, {c}) {
    let writeRes = null

    try {
        writeRes = await c.insertOne(fields)
    } catch(e) {
        if (121 === e.code) e = new InvalidData()
        throw e
    }

    return true
}

/**
    @param {id, in Types} id
*/
async function storeUpdate(id, fields, {c}) {
    let res = null
    try {
        res = await c.updateOne({_id: id}, {$set: fields})
    } catch(e) {
        if (121 === e.code) e = new InvalidData()
        throw e
    }

    if (!res.matchedCount) throw m.ResourceNotFound.create("the given id didn't match any products")

    return true
}

async function storeGetById(id, {c, validateObjectId, m}) {
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
    // first, validate id (see update, storeGetById: whether to validate id)
    // also, make sure that fields doesn't contain _id, because it's not allowed to change a document's id

    let res = null
    try {
        res = await update(id, fields)
    } catch (e) {
        // 121 is validation error: erroneous response example in https://www.mongodb.com/docs/manual/core/schema-validation/#existing-documents
        if (!(e instanceof InvalidData)) throw e

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
