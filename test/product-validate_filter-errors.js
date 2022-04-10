import {assert} from 'chai'

import {toTree} from 'ajv-errors-to-data-tree'
import {validate, filterErrors, _validate} from '../src/_product-validate.js'

function testFilterErrors() {
    describe("no fields and: 1. missing isInSale; 2. invalid isInSale. Contains a single error:", () => {
        _validate({})
        const missing = toTree(_validate.errors)

        _validate({isInSale: 5})
        const invalid = toTree(_validate.errors)

        it("1. a 'required' error for isInSale", () => {
            filterErrors(missing)

            // console.log("testFilterErrors, no fields, missing, contains a 'required' error for isInSale, missing:", missing);
            assert(
                // tree.node only includes isInSale;
                1 === Object.keys(missing.node).length && 'isInSale' in missing.node

                // tree.node.isInSale only has one error;
                // the error keyword is 'required'
                && 1 === missing.node.isInSale.errors.length && 'required' === missing.node.isInSale.errors[0].data.keyword
            )
        })

        it("2. a 'type' error for isInSale", () => {
            filterErrors(invalid)

            // console.log("testFilterErrors, no fields, missing, contains a 'required' error for isInSale, missing:", invalid.node.isInSale.errors);
            assert(
                // tree.node only includes isInSale;
                1 === Object.keys(invalid.node).length && 'isInSale' in invalid.node

                // tree.node.isInSale only has one error;
                // the error keyword is 'type'
                && 1 === invalid.node.isInSale.errors.length && 'type' === invalid.node.isInSale.errors[0].data.keyword
            )
        })
    })

    // describe("one invalid field and: 1. missing isInSale; 2. invalid isInSale. Contains two errors:", () => {
    //     _validate({name: 5})
    //     const missing =  toTree(_validate.errors)
    //
    //     _validate({isInSale: 5, name: 5})
    //     const invalid =  toTree(_validate.errors)
    //
    //     it("1. a 'required' error for isInSale and 'type' error for name", () => {
    //         filterErrors(missing)
    //     })
    //
    //     it("2. a 'type' error for isInSale and 'type' error for name", () => {
    //         filterErrors(invalid)
    //     })
    // })
    //
    // describe("true isInSale, invalid field", () => {
    //     _validate({isInSale: true, name: 5})
    //     const tree = toTree(_validate.errors)
    //
    //     it("contains two errors: a 'type' error for name and a 'required' error for itemInitial", () => {
    //         filterErrors(tree)
    //     })
    // })
}

export {testFilterErrors}
