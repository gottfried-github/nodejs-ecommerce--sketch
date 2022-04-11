import {assert} from 'chai'

import {jsonValidateData} from './product-validate_JSON-validate-data.js'
import {bsonValidateData} from "./product-validate_BSON-validate-data.js"

import {validate} from "../src/_product-validate.js"

function testValidate() {
    describe("JSON validate data", () => {
        describe("no fields and: 1. missing isInSale; 2. invalid isInSale. Contains a single error:", () => {
            const missing = validate(jsonValidateData.missingNoFields.data)

            const invalid = validate(jsonValidateData.invalidNoFields.data)

            it(`1. ${jsonValidateData.missingNoFields.description}`, () => {
                // console.log("testFilterErrors, no fields, missing, contains a 'required' error for isInSale, missing:", missing);

                jsonValidateData.missingNoFields.assert(missing)
            })

            it(`2. ${jsonValidateData.invalidNoFields.description}`, () => {
                // console.log("testFilterErrors, no fields, missing, contains a 'required' error for isInSale, missing:", invalid.node.isInSale.errors);

                jsonValidateData.invalidNoFields.assert(invalid)
            })
        })

        describe("one invalid field and: 1. missing isInSale; 2. invalid isInSale. Contains two errors:", () => {
            const missing = validate(jsonValidateData.missingInvalidField.data)

            const invalid = validate(jsonValidateData.invalidInvalidField.data)

            it(`1. ${jsonValidateData.missingInvalidField.description}`, () => {
                // console.log("testFilterErrors, one invalid field, missing, filtered errors - missing:", missing.node);

                jsonValidateData.missingInvalidField.assert(missing)
            })

            it(`1. ${jsonValidateData.invalidInvalidField.description}`, () => {
                jsonValidateData.invalidInvalidField.assert(invalid)
            })
        })

        describe("true isInSale, invalid field", () => {
            const tree = validate(jsonValidateData.trueInvalidField.data)

            it(jsonValidateData.trueInvalidField.description, () => {
                jsonValidateData.trueInvalidField.assert(tree)
            })
        })
    })
}

export {testValidate}
