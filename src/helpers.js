import {ObjectId} from 'mongodb'
import {traverseTree} from 'ajv-errors-to-data-tree/src/helpers.js'
import * as m from './messages.js'

function _parseFirstOneOfItemPath(schemaPath) {
    const nodeNames = schemaPath.split('/')
    if (0 === nodeNames[0].length) nodeNames.shift()

    let oneOfI = null

    for (const [i, name] of nodeNames.entries()) {
        if ('oneOf' === name) { oneOfI = i; break }
    }

    if (null === oneOfI) return oneOfI

    const oneOfPath = nodeNames.slice(0, oneOfI+2).reduce((str, nodeName, i) => {
        str += `/${nodeName}`
        return str
    }, '')

    return oneOfPath
}

// see do validation in a specialized method
function validateObjectId(id) {
    if ([null, undefined].includes(id)) return new Error(`id cannot be null or undefined`)

    try {
        new ObjectId(id)
    } catch(e) {
        return e
    }

    return null
}

// see do validation in a specialized method
function containsId(data) {
    return '_id' in data ? '_id' : false
}

function isValidBadInputTree(tree) {
    try {
        traverseTree(tree, (e) => {
            // console.log("isValidBadInputTree, traversingTree, e:", e);
            const badReqErrs = [(e) => m.FieldMissing.code === e.code, (e) => m.TypeErrorMsg.code === e.code, (e) => m.EmptyError.code === e.code, (e) => m.ValidationError.code === e.code]

            if (!badReqErrs.map(isE => isE(e)).includes(true)) {
                // console.log("isValidBadInputTree, traversingTree, e is not a badReqErr, e:", e);
                throw m.InvalidErrorFormat.create()
            }
        })
    } catch (e) {
        if (m.InvalidErrorFormat.code !== e.code) throw e
        // console.log("isValidBadInputTree, traverseTree thrown, e:", e)
        return false
    }

    return true
}

export {_parseFirstOneOfItemPath, validateObjectId, containsId}
