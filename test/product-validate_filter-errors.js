import {toTree} from 'ajv-errors-to-data-tree'

import {jsonValidateData} from './product-validate_JSON-validate-data.js'

import {filterErrors, _validate} from '../src/_product-validate.js'

function testFilterErrors() {
    describe("no fields and: 1. missing isInSale; 2. invalid isInSale. Contains a single error:", () => {
        _validate(jsonValidateData.missingNoFields.data)
        const missing = toTree(_validate.errors)

        _validate(jsonValidateData.invalidNoFields.data)
        const invalid = toTree(_validate.errors)

        it(`1. ${jsonValidateData.missingNoFields.description}`, () => {
            filterErrors(missing)

            // console.log("testFilterErrors, no fields, missing, contains a 'required' error for isInSale, missing:", missing);
            jsonValidateData.missingNoFields.assert(missing)
        })

        it(`2. ${jsonValidateData.invalidNoFields.description}`, () => {
            filterErrors(invalid)

            // console.log("testFilterErrors, no fields, missing, contains a 'required' error for isInSale, missing:", invalid.node.isInSale.errors);
            jsonValidateData.invalidNoFields.assert(invalid)
        })
    })

    describe("one invalid field and: 1. missing isInSale; 2. invalid isInSale. Contains two errors:", () => {
        _validate(jsonValidateData.missingInvalidField.data)
        const missing =  toTree(_validate.errors)

        _validate(jsonValidateData.invalidInvalidField.data)
        const invalid =  toTree(_validate.errors)

        it(`1. ${jsonValidateData.missingInvalidField.description}`, () => {
            filterErrors(missing)
            // console.log("testFilterErrors, one invalid field, missing, filtered errors - missing:", missing.node);

            jsonValidateData.missingInvalidField.assert(missing)
        })

        it(`1. ${jsonValidateData.invalidInvalidField.description}`, () => {
            filterErrors(invalid)

            jsonValidateData.invalidInvalidField.assert(invalid)
        })
    })

    describe("true isInSale, invalid field", () => {
        _validate(jsonValidateData.trueInvalidField.data)
        const tree = toTree(_validate.errors)

        it(jsonValidateData.trueInvalidField.description, () => {
            filterErrors(tree)

            jsonValidateData.trueInvalidField.assert(tree)
        })
    })
}

export {testFilterErrors}
