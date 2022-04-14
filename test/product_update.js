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

    // describe("validateObjectId returns truthy", () => {
    //     it("throws InvalidCriterion and doesn't call any other dependencies", () => {
    //         const updateCalls = [], getByIdCalls = [], validateCalls = [], validateObjectIdCalls = [], containsIdCalls = []
    //         try {
    //             _update("", )
    //         } catch(e) {
    //
    //         }
    //     })
    // })
}

export {testUpdate}
