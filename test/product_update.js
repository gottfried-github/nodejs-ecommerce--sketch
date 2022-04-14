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
}

export {testUpdate}
