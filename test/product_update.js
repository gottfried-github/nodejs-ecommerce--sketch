import {assert} from 'chai'
import * as m from 'bazar-api/src/messages.js'

import {_update} from '../src/_product.js'

function testUpdate() {
    describe("is passed an id", () => {
        it("passes the 'id' argument to validateObjectId", async () => {
            const id = "an id"
            let isEqual = null
            await _update(id, {}, {update: async () => {}, getById: async () => {}, validate: () => {},
                validateObjectId: (_id) => {isEqual = id === _id}, containsId: () => {}
            })

            assert.strictEqual(isEqual, true)
        })
    })

    describe("validateObjectId returns truthy", () => {
        it("throws InvalidCriterion with the returned value as data AND doesn't call any other dependencies", async () => {
            // see '`_product`, testing `_update`: the order of `validateObjectId` and `containsId` doesn't matter' for why I don't check whether containsId has been called
            const updateCalls = [], getByIdCalls = [], validateCalls = []
            const idE = "a error with id"
            try {
                await _update("", {}, {
                    update: async () => {updateCalls.push(null)},
                    getById: async () => {getByIdCalls.push(null)},
                    validate: () => {validateCalls.push(null)},
                    validateObjectId: () => {return idE},
                    containsId: () => {return false}
                })
            } catch(e) {
                return assert(
                    // error is an InvalidCriterion
                    m.InvalidCriterion.code === e.code

                    && idE === e.data

                    // none of the other dependencies has been called
                    && [updateCalls.length, getByIdCalls.length, validateCalls.length].filter(l => 0 !== l).length === 0
                )
            }

            assert.fail("_update didn't throw")
        })
    })

    describe("containsId returns truthy", () => {
        it("throws an ajv-errors-to-data-tree tree with _id set to FieldUnknown with the returned value as data AND doesn't call any other dependencies", async () => {
            const updateCalls = [], getByIdCalls = [], validateCalls = []
            const idFieldName = "_id"
            try {
                await _update("", {}, {
                    update: async () => {updateCalls.push(null)},
                    getById: async () => {getByIdCalls.push(null)},
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

    describe("validateObjectId and containsId return falsy", () => {
        it("update gets called AND the arguments are passed to it", async () => {
            const id = "an id", fields = "fields"
            let isEqual = null

            await _update(id, fields, {
                update: async (_id, _fields) => {isEqual = id === _id && fields === _fields},
                getById: async () => {},
                validate: () => {},
                validateObjectId: () => {return false},
                containsId: (data) => {return false}
            })

            assert.strictEqual(isEqual, true)
        })
    })

    describe("update throws a non-InvalidData error", () => {
        it("throws the error on AND doesn't call any other dependencies", async () => {
            const getByIdCalls = [], validateCalls = []
            const ERR_MSG = "an error message"

            try {
                await _update("", {}, {
                    update: async () => {throw new Error(ERR_MSG)},
                    getById: async () => {getByIdCalls.push(null)},
                    validate: () => {validateCalls.push(null)},
                    validateObjectId: () => {return false},
                    containsId: () => {return false}
                })
            } catch(e) {
                return assert(
                    // error is the one, thrown by update
                    ERR_MSG === e.message

                    // none of the other dependencies has been called
                    && [getByIdCalls.length, validateCalls.length].filter(l => 0 !== l).length === 0
                )
            }

            assert.fail("_update didn't throw")
        })
    })

    describe("update doesn't throw", () => {
        it("returns true AND doesn't call any other dependencies", async () => {
            const getByIdCalls = [], validateCalls = []
            const res = await _update("", {}, {
                update: async () => {},
                getById: async () => {getByIdCalls.push(null)},
                validate: () => {validateCalls.push(null)},
                validateObjectId: () => {return false},
                containsId: () => {return false}
            })

            return assert(
                true === res

                // none of the other dependencies has been called
                && [getByIdCalls.length, validateCalls.length].filter(l => 0 !== l).length === 0
            )
        })
    })
}

export {testUpdate}
