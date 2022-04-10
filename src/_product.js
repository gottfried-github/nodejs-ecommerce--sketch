import * as m from 'bazar-api/app/src/messages.js'

async function storeCreate(fields, {c}) {
    writeRes = await c.insertOne(fields)

    return true
}

async function storeUpdate(id, fields, {c}) {
    const res = await c.updateOne({_id: id}, {$set: fields})

    if (!res.matchedCount) throw m.ResourceNotFound.create("the given id didn't match any products")

    return true
}

async function storeGetById(id, {c, validateObjectId, m}) {
    // try {
    //     id = validateObjectId(id)
    // } catch(e) {
    //     if (!('code' in e) || m.ValidationErrors.code !== e.code) throw e
    //     throw m.ValidationErrorsObj.create({id: e})
    // }

    const res = c.findOne({_id: id})

    return res
}

async function create(fields, {create, validate}) {
    try {
        await storeCreate(fields)
    } catch(e) {
        if (121 !== e.code) throw e
        validate(fields)

        throw new Error("mongodb validation fails while model level validation succeeds")
    }
}

async function update(id, fields, {update, validate}) {
    let res = null
    try {
        res = await update(id, fields)
    } catch (e) {
        // 121 is validation error: erroneous response example in https://www.mongodb.com/docs/manual/core/schema-validation/#existing-documents
        if (121 !== e.code) throw e

        // do additional validation only if builtin validation fails. See mongodb with bsonschema: is additional data validation necessary?
        const doc = await getById(id)
        validate(Object.assign(doc, fields))

        throw new Error("mongodb validation fails while model level validation succeeds")
    }
}
