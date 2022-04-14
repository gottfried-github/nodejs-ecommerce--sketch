import {assert} from 'chai'
import * as m from 'bazar-api/src/messages.js'

import {_update} from '../src/_product.js'

function testUpdate() {
    describe("an id", () => {
        it("passes the 'id' argument to validateObjectId", async () => {
            const id = "an id"
            let isEqual = null
            await _update(id, {}, {update: () => {}, getById: () => {}, validate: () => {},
                validateObjectId: (_id) => {isEqual = id === _id}, containsId: () => {}
            })

            assert.strictEqual(isEqual, true)
        })
    })

    describe("validateObjectId returns truthy", () => {
        it("throws InvalidCriterion with the returned value as data AND doesn't call any other dependencies", async () => {
            const updateCalls = [], getByIdCalls = [], validateCalls = [], containsIdCalls = []
            const idE = "a error with id"
            try {
                await _update("", {}, {
                    update: () => {updateCalls.push(null)},
                    getById: () => {getByIdCalls.push(null)},
                    validate: () => {validateCalls.push(null)},
                    validateObjectId: () => {return idE},
                    containsId: () => {containsIdCalls.push(null)}
                })
            } catch(e) {
                return assert(
                    // error is an InvalidCriterion
                    m.InvalidCriterion.code === e.code

                    && idE === e.data

                    // none of the other dependencies has been called
                    && [updateCalls.length, getByIdCalls.length, validateCalls.length, containsIdCalls.length].filter(l => 0 !== l).length === 0
                )
            }

            assert.fail("_update didn't throw")
        })
    })

    describe("validateObjectId returns falsy", () => {
        it("containsId gets called AND 'fields' argument is passed to it", () => {
            const fields = "fields"
            let isEqual = null

            _update("", fields, {
                update: () => {},
                getById: () => {},
                validate: () => {},
                validateObjectId: () => {return false},
                containsId: (data) => {isEqual = fields === data}
            })

            assert.strictEqual(isEqual, true)
        })
    })

    describe("containsId returns truthy", () => {
        it("throws an ajv-errors-to-data-tree tree with _id set to FieldUnknown with the returned value as data AND doesn't call any other dependencies", async () => {
            const updateCalls = [], getByIdCalls = [], validateCalls = []
            const idFieldName = "_id"
            try {
                await _update("", {}, {
                    update: () => {updateCalls.push(null)},
                    getById: () => {getByIdCalls.push(null)},
                    validate: () => {validateCalls.push(null)},
                    validateObjectId: () => {return false},
                    containsId: () => {return idFieldName}
                })
            } catch(e) {
                return assert(
                    // there's only _id property in e.node and it has a single error
                    1 === Object.keys(e.node).length && 1 === e.node._id?.errors.length

                    // the error is FieldUnknown with data being the value returned by containsId
                    && m.FieldUnknown.code === e.node._id.errors[0].code
                    // && idFieldName === e.node._id.errors[0].data

                    // none of the other dependencies has been called
                    && [updateCalls.length, getByIdCalls.length, validateCalls.length].filter(l => 0 !== l).length === 0
                )
            }

            assert.fail("_update didn't throw")
        })
    })
}

export {testUpdate}
