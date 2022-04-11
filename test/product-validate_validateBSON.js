import {assert} from 'chai'
import {ObjectId} from 'mongodb'
import {BSONTypeError} from "bson"

// import {toTree} from 'ajv-errors-to-data-tree'
import {_validateBSON} from '../src/_product-validate.js'

function testValidateBSON() {
    describe("itemInitial is an invalid string objectId", () => {
        const id = "an invalid id"
        const fields = {itemInitial: id}
        const errors = _validateBSON(fields)

        it("returns truthy", () => {
            assert(!!errors)
        })

        it("contains a single error, regarding itemInitial", () => {
            assert(
                // itemInitial is the only node and it has only one error
                1 === Object.keys(errors.node).length && 'itemInitial' in errors.node && 1 === errors.node.itemInitial.errors.length
            )
        })

        it("the error is the same as ObjectId's", () => {
            try {
                new ObjectId(id)
            } catch(e) {
                assert(
                    // error is a BSONTypeError and is the same as the error thrown by ObjectId
                    errors.node.itemInitial.errors[0] instanceof BSONTypeError
                    && e.message === errors.node.itemInitial.errors[0].message
                )
            }
        })
    })

    describe("itemInitial is a valid string objectId", () => {
        const fields = {itemInitial: new ObjectId().toString()}

        it("returns null", () => {
            assert.strictEqual(_validateBSON(fields), null)
        })
    })
}

export {testValidateBSON}
