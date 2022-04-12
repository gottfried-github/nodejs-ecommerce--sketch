import {toTree} from 'ajv-errors-to-data-tree'
import {testJSONErrors} from './product-validate_testJSONErrors.js'

import {filterErrors, _validate} from '../src/_product-validate.js'

function testFilterErrors() {
    const tests = {
        isInSaleRequired: [{
            i: [((data) => {
                _validate(data)
                // console.log("filterErrors tests, isInSaleRequired, i - data:", data);
                return toTree(_validate.errors)
            })({})],
            o: (errors) => {filterErrors(errors); return errors},
            description: "isInSale missing and no fields"
        }],
        isInSaleType: [{
            i: [((data) => {
                _validate(data)
                return toTree(_validate.errors)
            })({isInSale: 5})],
            o: (errors) => {filterErrors(errors); return errors},
            description: "isInSale invalid and no fields"
        }],
        isInSaleRequiredNameType: [{
            i: [((data) => {
                _validate(data)
                return toTree(_validate.errors)
            })({name: 5})],
            o: (errors) => {filterErrors(errors); return errors},
            description: "isInSale missing and name invalid"
        }],
        isInSaleNameType: [{
            i: [((data) => {
                _validate(data)
                return toTree(_validate.errors)
            })({isInSale: 5, name: 5})],
            o: (errors) => {filterErrors(errors); return errors},
            description: "isInSale invalid and name invalid"
        }],
        nameTypeItemInitialRequired: [{
            i: [((data) => {
                _validate(data)
                return toTree(_validate.errors)
            })({isInSale: true, name: 5})],
            o: (errors) => {filterErrors(errors); return errors},
            description: "isInSale true and name invalid"
        }],
    }

    testJSONErrors(tests)
}

export {testFilterErrors}
