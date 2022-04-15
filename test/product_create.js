function testCreate() {
    describe("create throws a non-InvalidData error", () => {
        it("throws the error on AND doesn't call any other dependencies", async () => {
            const validateCalls = []
            const ERR_MSG = "an error message"

            try {
                await _update("", {}, {
                    create: async () => {throw new Error(ERR_MSG)},
                    validate: () => {validateCalls.push(null)},
                })
            } catch(e) {
                return assert(
                    // error is the one, thrown by update
                    ERR_MSG === e.message

                    // none of the other dependencies has been called
                    && [validateCalls.length].filter(l => 0 !== l).length === 0
                )
            }

            assert.fail("_update didn't throw")
        })
    })

    describe("create throws an InvalidData", () => {
        it("validate is called with the 'fields' argument", async () => {
            const fields = {a: 0, b: 1}, doc = {b: 2}
            let _fieldsCorrect = null

            // once getById is called, validate should be called and then _update should throw
            try {
                const res = await _update("", fields, {
                    create: async () => {throw new InvalidData()},
                    validate: (_fields) => {
                        const keys = Object.keys(_fields)
                        _fieldsCorrect = 2 === keys.length && keys.includes('a') && keys.includes('b')
                        && fields.a === _fields.a && doc.b === _fields.b
                    },
                })
            } catch(e) {
                return assert.strictEqual(_fieldsCorrect, true)
            }

            assert.fail()
        })

        describe("validate returns falsy", () => {
            it("throws ValidationConflict", async () => {
                try {
                    await _update("", {}, {
                        create: async () => {throw new InvalidData()},
                        validate: () => {
                            return false
                        },
                    })
                } catch(e) {
                    return assert.instanceOf(e, ValidationConflict)
                }

                assert.fail()
            })
        })

        describe("validate returns truthy", () => {
            it("throws the returned value", async () => {
                const errors = "errors"

                try {
                    await _update("", {}, {
                        create: async () => {throw new InvalidData()},
                        validate: () => {
                            return errors
                        },
                    })
                } catch(e) {
                    return assert.strictEqual(e, errors)
                }

                assert.fail()
            })
        })
    })

    describe("create doesn't throw", () => {
        it("returns true AND doesn't call any other dependencies", async () => {
            const validateCalls = []
            const res = await _update("", {}, {
                create: async () => {},
                validate: () => {validateCalls.push(null)},
            })

            return assert(
                true === res

                // none of the other dependencies has been called
                && [validateCalls.length].filter(l => 0 !== l).length === 0
            )
        })
    })
}
