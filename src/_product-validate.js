import Ajv from 'ajv'
import {ObjectId} from 'mongodb'

import {toTree} from 'ajv-errors-to-data-tree'
import {traverseTree} from 'ajv-errors-to-data-tree/src/helpers.js'

import * as m from 'bazar-api/src/messages.js'

import {_parseFirstOneOfItemPath} from './helpers.js'

const ajv = new Ajv({allErrors: true, strictRequired: true})

const otherProps = {
    name: {
        type: "string"
    },
    itemInitial: {
        type: "string"
    }
}

const schema = {
    oneOf: [
        {
            type: "object",
            properties: {
                isInSale: {
                    type: "boolean",
                    enum: [true]
                },
                name: otherProps.name,
                itemInitial: otherProps.itemInitial,
            },
            required: ["isInSale", "name", "itemInitial"]
        },
        {
            type: "object",
            properties: {
                isInSale: {
                    type: "boolean",
                    enum: [false]
                },
                name: otherProps.name,
                itemInitial: otherProps.itemInitial,
            },
            required: ["isInSale"]
        }
    ]
}
const _validate = ajv.compile(schema)

function filterErrors(errors) {
    // 1, 1.2 in Filtering out irrelevant errors
    const isInSaleErr = errors.node.isInSale?.errors.find(e => 'required' === e.data.keyword || 'type' === e.data.keyword)

    if (isInSaleErr) {
        traverseTree(errors, (e, fieldname) => {
            // 1.1, 1.2, 1.3 in Filtering out irrelevant errors
            if (_parseFirstOneOfItemPath(isInSaleErr.data.schemaPath) === _parseFirstOneOfItemPath(e.data.schemaPath) || 'required' === e.data.keyword && 'isInSale' !== fieldname || 'enum' === e.data.keyword) return null
        })

        return
    }

    // 2 in Filtering out irrelevant errors

    const redundantSchemas = []

    // store the schema of the 'enum' error
    traverseTree(errors, (e) => {
        if ('enum' === e.data.keyword) redundantSchemas.push(e.data.schemaPath)
    })

    const redundantOneOfSchemas = redundantSchemas.map(v => _parseFirstOneOfItemPath(v))

    // console.log("filterErrors, redundantSchemas:", redundantSchemas, JSON.stringify(errors, null, 2));

    // exclude the schemas that have the 'enum' error
    traverseTree(errors, (e) => {
        if (redundantOneOfSchemas.includes(_parseFirstOneOfItemPath(e.data.schemaPath))) return null
    })

    return
}

function _validateBSON(fields) {
    if (!('itemInitial' in fields)) return null

    try {
        new ObjectId(fields.itemInitial)
    } catch(e) {
        return {
            errors: [],
            node: {
                itemInitial: {
                    errors: [e],
                    node: null
                }
            }
        }
    }

    return null
}

function validate(fields) {
    if (_validate(fields)) {
        return _validateBSON(fields)
    }

    const errors = toTree(_validate.errors, (e) => {
        // console.log("toTree, cb - e:", e);

        // see Which errors should not occur in the data
        if ('additionalProperties' === e.keyword) throw new Error("data contains fields, not defined in the spec")

        return {message: e.message, data: e}
        // if ('required' === e.data.keyword) return m.FieldMissing.create(e.message, e.data)
        // if ('type' === e.data.keyword) {
        //     const _e = new TypeError(e.data.message)
        //     _e.data = e.data
        //     return _e
        // }
        //
        // return m.ValidationError.create(e.message, e.data)
    })

    filterErrors(errors)

    if (errors.node.itemInitial) return errors

    const bsonErrors = _validateBSON(fields)
    if (bsonErrors) {
        errors.node.itemInitial = {
            errors: [m.ValidationError.create(bsonErrors.node.itemInitial.errors[0].message, bsonErrors.node.itemInitial.errors[0])],
            node: null,
        }
    }

    return errors
}

export {validate, _validateBSON, filterErrors, _validate}
