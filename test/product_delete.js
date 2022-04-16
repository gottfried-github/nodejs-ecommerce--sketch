import {assert} from 'chai'
import * as m from 'bazar-api/src/messages.js'

import {_delete} from '../src/_product.js'

function testDelete() {
    describe("is passed an id", () => {
        it("passes the 'id' argument to validateObjectId", async () => {
            const id = "an id"
            let isEqual = null
            await _delete(id, {
                validateObjectId: (_id) => {isEqual = id === _id},
                storeDelete: async () => {},
            })

            assert.strictEqual(isEqual, true)
        })
    })

    describe("validateObjectId returns truthy", () => {
        it("throws InvalidCriterion with the returned value as data AND doesn't call any other dependencies", async () => {
            // see '`_product`, testing `_delete`: the order of `validateObjectId` and `containsId` doesn't matter' for why I don't check whether containsId has been called
            const storeDeleteCalls = []
            const idE = "a error with id"
            try {
                await _delete("", {
                    validateObjectId: () => {return idE},
                    storeDelete: async () => {storeDeleteCalls.push(null)},
                })
            } catch(e) {
                return assert(
                    // error is an InvalidCriterion
                    m.InvalidCriterion.code === e.code

                    && idE === e.data

                    // none of the other dependencies has been called
                    && [storeDeleteCalls.length].filter(l => 0 !== l).length === 0
                )
            }

            assert.fail("_delete didn't throw")
        })
    })

    describe("validateObjectId returns falsy", () => {
        it("storeDelete gets called AND the arguments are passed to it", async () => {
            const id = "an id"
            let isEqual = null

            await _delete(id, {
                validateObjectId: () => {return false},
                storeDelete: async (_id) => {isEqual = id === _id},
            })

            assert.strictEqual(isEqual, true)
        })
    })
}

export {testDelete}
