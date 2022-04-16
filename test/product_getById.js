function testGetById() {
    describe("is passed an id", () => {
        it("passes the 'id' argument to validateObjectId", async () => {
            const id = "an id"
            let isEqual = null
            await _getById(id, {
                validateObjectId: (_id) => {isEqual = id === _id},
                getById: async () => {},
            })

            assert.strictEqual(isEqual, true)
        })
    })

    describe("validateObjectId returns truthy", () => {
        it("throws InvalidCriterion with the returned value as data AND doesn't call any other dependencies", async () => {
            // see '`_product`, testing `_getById`: the order of `validateObjectId` and `containsId` doesn't matter' for why I don't check whether containsId has been called
            const getByIdCalls = []
            const idE = "a error with id"
            try {
                await _getById("", {}, {
                    validateObjectId: () => {return idE},
                    getById: async () => {getByIdCalls.push(null)},
                })
            } catch(e) {
                return assert(
                    // error is an InvalidCriterion
                    m.InvalidCriterion.code === e.code

                    && idE === e.data

                    // none of the other dependencies has been called
                    && [getByIdCalls.length].filter(l => 0 !== l).length === 0
                )
            }

            assert.fail("_getById didn't throw")
        })
    })

    describe("validateObjectId returns falsy", () => {
        it("getById gets called AND the arguments are passed to it", async () => {
            const id = "an id", fields = "fields"
            let isEqual = null

            await _getById(id, fields, {
                validateObjectId: () => {return false},
                getById: async (_id) => {isEqual = id === _id},
            })

            assert.strictEqual(isEqual, true)
        })
    })

    describe("getById returns", () => {
        it("returns the returned value", async () => {

        })
    })
}
