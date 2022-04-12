import {assert} from 'chai'
import {ObjectId} from 'mongodb'

import {testBSONErrors} from './product-validate_testBSONErrors.js'
import {testJSONErrors} from './product-validate_testJSONErrors.js'

import {validate} from "../src/_product-validate.js"

const testsJSON = {
    isInSaleRequired: [{
        i: [{}],
        o: validate,
        description: "isInSale missing and no fields"
    }],
    isInSaleType: [{
        i: [{isInSale: 5}],
        o: validate,
        description: "isInSale invalid and no fields"
    }],
    isInSaleRequiredNameType: [{
        i: [{name: 5}],
        o: validate,
        description: "isInSale missing and name invalid"
    }],
    isInSaleNameType: [{
        i: [{isInSale: 5, name: 5}],
        o: validate,
        description: "isInSale invalid and name invalid"
    }],
    nameTypeItemInitialRequired: [{
        i: [{isInSale: true, name: 5}],
        o: validate,
        description: "isInSale true and name invalid"
    }],
}

const testsBSON = {
    singleCorrectError: [{
        i: [{isInSale: false, itemInitial: "an invalid id"}],
        o: validate,
        description: "JSON-valid but BSON-invalid: itemInitial is an invalid string objectId"
    }],
    returnsNull: [{
        i: [{isInSale: false, itemInitial: new ObjectId().toString()}],
        o: validate,
        description: "JSON-valid and BSON-valid: itemInitial is a valid string objectId"
    }]
}

function testValidate() {
    describe("JSON validate data", () => {
        testJSONErrors(testsJSON)
    })

    describe("BSON validate data", () => {
        testBSONErrors(testsBSON)
    })
}

export {testValidate}
