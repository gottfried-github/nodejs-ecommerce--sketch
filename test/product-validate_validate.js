import {assert} from 'chai'
import {ObjectId} from 'mongodb'
import {BSONTypeError} from 'bson'

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
        description: "both JSON- and BSON-valid: itemInitial is a valid string objectId"
    }]
}

function testValidate() {
    describe("JSON validate data", () => {
        testJSONErrors(testsJSON)
    })

    describe("BSON validate data", () => {
        testBSONErrors(testsBSON)
    })

    describe("mixed validation", () => {
        describe("both JSON- and BSON-invalid: invalid isInSale, invalid string objectId itemInitial", () => {
            it("contains ONLY a 'type' error for isInSale and a BSONTypeError for itemInitial", (() => {
                const id = "an invalid id"
                const errors = validate({isInSale: 5, itemInitial: id})

                // console.log('errors:', errors.node.isInSale.errors)
                try {
                    new ObjectId(id)
                } catch(e) {
                    const keys = Object.keys(errors.node)
                    
                    assert(
                        // tree.node only includes the two fields
                        2 === keys.length && keys.includes('isInSale') && keys.includes('itemInitial')

                        && 1 === errors.node.isInSale.errors.length && 'type' === errors.node.isInSale.errors[0].data.keyword
                        && 1 === errors.node.itemInitial.errors.length
                        && errors.node.itemInitial.errors[0].data instanceof BSONTypeError && e.message === errors.node.itemInitial.errors[0].message
                    )
                }
            }))
        })
    })
}

export {testValidate}
