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

        throw errors
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
}

function validate(fields) {
    if (_validate(fields)) return null

    const errors = toTree(_validate.errors, (e) => {
        return m.ValidationError.create(e.message, e.data)
    })

    filterErrors(errors)

    throw errors
}

export {validate as default, filterErrors}
