import {assert} from 'chai'

import {ObjectId} from 'mongodb'
import {BSONTypeError} from "bson"

import {_validateBSON} from '../src/_product-validate.js'

// import {toTree} from 'ajv-errors-to-data-tree'
const id = "an invalid id"

function testBSONErrors(tests) {
    describe("contains a single error - a correct one - regarding itemInitial", () => {
        it("returns truthy", () => {
            assert(!!tests.singleCorrectError.o(...tests.singleCorrectError.i))
        })

        it("contains a single error, regarding itemInitial", () => {
            const errors = tests.singleCorrectError.o(...tests.singleCorrectError.i)
            assert(
                // itemInitial is the only node and it has only one error
                1 === Object.keys(errors.node).length && 'itemInitial' in errors.node && 1 === errors.node.itemInitial.errors.length
            )
        })

        it("the error is the same as ObjectId's", () => {
            const errors = tests.singleCorrectError.o(...tests.singleCorrectError.i)

            try {
                new ObjectId(id)
            } catch(e) {
                return assert(
                    // error is a BSONTypeError and is the same as the error thrown by ObjectId
                    errors.node.itemInitial.errors[0] instanceof BSONTypeError
                    && e.message === errors.node.itemInitial.errors[0].message
                )
            }
        })
    })

    tests.returnsNull.forEach(t => {
        it("returns null", () => {
            assert.strictEqual(t.o(t.i), null)
        })
    })
}

export {testBSONErrors}
