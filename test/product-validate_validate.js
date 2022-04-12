import {assert} from 'chai'
import {ObjectId} from 'mongodb'

import {jsonValidateData} from './product-validate_JSON-validate-data.js'
import {_validateBSONTests} from "./product-validate_validateBSON.js"

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

    describe("JSON-valid but BSON-invalid", () => {
        const fields = {isInSale: false, itemInitial: "an invalid id"}
        const errors = validate(fields)

        it(_validateBSONTests.invalid.tests.truthy.description, () => {
            _validateBSONTests.invalid.tests.truthy.assert(errors)
        })

        it(_validateBSONTests.invalid.tests.singleErrorOfItemInitial.description, () => {
            _validateBSONTests.invalid.tests.singleErrorOfItemInitial.assert(errors)
        })

        it(_validateBSONTests.invalid.tests.correctError.description, () => {
            _validateBSONTests.invalid.tests.correctError.assert(errors)
        })

        describe("itemInitial is a valid string objectId", () => {
            const fields = {isInSale: false, itemInitial: new ObjectId()}
            const errors = validate(fields)
            // console.log()

            it(_validateBSONTests.valid.description, () => {
                _validateBSONTests.valid.assert(errors)
            })
        })

        describe("itemInitial is not set", () => {
            it(_validateBSONTests.notSet.description, () => {
                _validateBSONTests.notSet.assert(_validateBSON(_validateBSONTests.notSet.data))
            })
        })
    })
}

export {testValidate}
