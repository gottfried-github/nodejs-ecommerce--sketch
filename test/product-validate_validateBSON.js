import {assert} from 'chai'

import {ObjectId} from 'mongodb'
import {BSONTypeError} from "bson"

import {_validateBSON} from '../src/_product-validate.js'

// import {toTree} from 'ajv-errors-to-data-tree'
const id = "an invalid id"

const _validateBSONTests = {
    invalid: {
        data: {itemInitial: id},
        tests: {
            truthy: {
                assert(errors) {
                    return assert(!!errors)
                },
                description: "returns truthy"
            },
            singleErrorOfItemInitial: {
                assert(errors) {
                    return assert(
                        // itemInitial is the only node and it has only one error
                        1 === Object.keys(errors.node).length && 'itemInitial' in errors.node && 1 === errors.node.itemInitial.errors.length
                    )
                },
                description: "contains a single error, regarding itemInitial"
            },
            correctError: {
                assert(errors) {
                    try {
                        new ObjectId(id)
                    } catch(e) {
                        return assert(
                            // error is a BSONTypeError and is the same as the error thrown by ObjectId
                            errors.node.itemInitial.errors[0] instanceof BSONTypeError
                            && e.message === errors.node.itemInitial.errors[0].message
                        )
                    }
                },
                description: "the error is the same as ObjectId's"
            }
        },
    },
    valid: {
        data: {itemInitial: new ObjectId().toString()},
        assert(errors) {
            return assert.strictEqual(errors, null)
        },
        description: "returns null"
    },
    notSet: {
        data: {},
        assert(errors) {
            return assert.strictEqual(errors, null)
        },
        description: "returns null"
    }
}

function testValidateBSON() {
    describe("itemInitial is an invalid string objectId", () => {
        // const id = "an invalid id"
        // const fields = {itemInitial: id}
        const errors = _validateBSON(_validateBSONTests.invalid.data)

        it(_validateBSONTests.invalid.tests.truthy.description, () => {
            _validateBSONTests.invalid.tests.truthy.assert(errors)
        })

        it(_validateBSONTests.invalid.tests.singleErrorOfItemInitial.description, () => {
            _validateBSONTests.invalid.tests.singleErrorOfItemInitial.assert(errors)
        })

        it(_validateBSONTests.invalid.tests.correctError.description, () => {
            _validateBSONTests.invalid.tests.correctError.assert(errors)
        })
    })

    describe("itemInitial is a valid string objectId", () => {

        it(_validateBSONTests.valid.description, () => {
            _validateBSONTests.valid.assert(_validateBSON(_validateBSONTests.valid.data))
        })
    })

    describe("itemInitial is not set", () => {
        it(_validateBSONTests.notSet.description, () => {
            _validateBSONTests.notSet.assert(_validateBSON(_validateBSONTests.notSet.data))
        })
    })
}

export {testValidateBSON, _validateBSONTests}
