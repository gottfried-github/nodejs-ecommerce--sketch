import Ajv from 'ajv'
import {toTree} from 'ajv-errors-to-data-tree'
import {traverseTree} from 'ajv-errors-to-data-tree/src/helpers.js'

import * as m from 'bazar-api/app/src/messages.js'

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
        traverseTree(errors, (e) => {
            // 1.1, 1.2 in Filtering out irrelevant errors
            if (_parseFirstOneOfItemPath(isInSaleErr.data.schemaPath) === _parseFirstOneOfItemPath(e.data.schemaPath) || 'required' === e.data.keyword) return null
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

function validateBSON(fields) {
    return validateObjectId(fields.itemInitial)
}

function validate(fields) {
    if (_validate(fields)) {
        try {
            validateBSON(fields)
        } catch(e) {
            if (m.ValidationError.code !== e.code) throw e
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

    const errors = toTree(_validate.errors, (e) => {
        // see Which errors should not occur in the data
        if ('additionalProperties' === e.data.keyword) throw new Error("data contains fields, not defined in the spec")

        if ('required' === e.data.keyword) return m.FieldMissing.create(e.message, e.data)
        if ('type' === e.data.keyword) {
            const _e = new TypeError(e.data.message)
            _e.data = e.data
            return _e
        }

        return m.ValidationError.create(e.message, e.data)
    })

    filterErrors(errors)

    if (errors.node.itemInitial?.errors.length) return errors

    try {
        validateBSON(fields)
    } catch(e) {
        if (m.ValidationError.code !== e.code) throw e
        errors.node.itemInitial.errors.push(e)
    }

    return errors
}

export {validate as default, filterErrors, _validate}
