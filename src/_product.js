import * as m from 'bazar-api/app/src/messages.js'

async function storeCreate(fields, {c}) {
    writeRes = await c.insertOne(fields)

    return true
}

/**
    @param {id, in Types} id
*/
async function storeUpdate(id, fields, {c}) {
    const res = await c.updateOne({_id: id}, {$set: fields})

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

    // first, validate _id, if any (see 1 in Builtin and additional validation/Some solutions)
    // if ('_id' in fields)

    try {
        await storeCreate(fields)
    } catch(e) {
        if (121 !== e.code) throw e

        // strip away _id before passing fields (see 1 in Builtin and additional validation/Some points worth noting)
        // if ('_id' in fields) delete fields._id

        validate(fields)

        throw new Error("mongodb validation fails while model level validation succeeds")
    }
}

/**
    @param {id, in Types} id
    @param {fields, in Types} fields
*/
async function update(id, fields, {update, validate}) {
    // first, validate id (see update, storeGetById: whether to validate id)

    let res = null
    try {
        res = await update(id, fields)
    } catch (e) {
        // 121 is validation error: erroneous response example in https://www.mongodb.com/docs/manual/core/schema-validation/#existing-documents
        if (121 !== e.code) throw e

        // do additional validation only if builtin validation fails. See mongodb with bsonschema: is additional data validation necessary?
        const doc = await getById(id)

        // strip away the _id before passing to validate (see 1 in Builtin and additional validation/Some points worth noting)
        const _fields = Object.assign(doc, fields)
        delete _fields._id

        validate(_fields)

        throw new Error("mongodb validation fails while model level validation succeeds")
    }
}

/**
    @param {id, in Types} id
*/
async function getById() {
    // first, validate id (see update, storeGetById: whether to validate id)
}
