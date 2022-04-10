import {toTree} from 'ajv-errors-to-data-tree'
import {default, filterErrors, _validate} from '../src/_product-validate.js'

function filterErrors() {
    describe("no fields and: 1. missing isInSale; 2. invalid isInSale. Contains a single error:", () => {
        _validate({})
        const missing = toTree(_validate.errors)

        _validate({isInSale: 5})
        const invalid = toTree(_validate.erorrs)

        it("1. a 'required' error for isInSale", () => {
            filterErrors(missing)
            // tree.node only includes isInSale;
            // tree.node.isInSale only has one error;
            // the error keyword is 'required'
        })

        it("2. a 'type' error for isInSale", () => {
            filterErrors(invalid)
        })
    })

    describe("one invalid field and: 1. missing isInSale; 2. invalid isInSale. Contains two errors:", () => {
        _validate({name: 5})
        const missing =  toTree(_validate.errors)

        _validate({isInSale: 5, name: 5})
        const invalid =  toTree(_validate.errors)

        it("1. a 'required' error for isInSale and 'type' error for name", () => {
            filterErrors(missing)
        })

        it("2. a 'type' error for isInSale and 'type' error for name", () => {
            filterErrors(invalid)
        })
    })

    describe("true isInSale, invalid field", () => {
        _validate({isInSale: true, name: 5})
        const tree = toTree(_validate.errors)

        it("contains two errors: a 'type' error for name and a 'required' error for itemInitial", () => {
            filterErrors(tree)
        })
    })

    describe("returns a tree of errors", () => {
        // it("contains a single error: a 'required' error for isInSale", () => {
        //     _validate({})
        //     const tree = toTree(_validate.errors)
        //     filterErrors(tree)
        //
        //     // tree.node only includes isInSale;
        //     // tree.node.isInSale only has one error;
        //     // the error keyword is 'required'
        // })

        // it("contains a single error: a 'type' error for isInSale", () => {
        //     _validate({isInSale: 5})
        //     const tree = toTree(_validate.errors)
        //     filterErrors(tree)
        // })

        // it("contains a single error: a 'type' error for isInSale", () => {
        //     _validate({isInSale: 5, name: 10})
        //     const tree = toTree(_validate.errors)
        //     filterErrors(tree)
        // })

        // it("contains a single error: a 'required' error for itemInitial", () => {
        //     _validate({isInSale: true, name: 'a name'})
        //     const tree = toTree(_validate.errors)
        //     filterErrors(tree)
        // })

        // it("contains two errors: a 'required' error for itemInitial; a 'type' error for name", () => {
        //     _validate({isInSale: true, name: 5})
        //     const tree = toTree(_validate.errors)
        //     filterErrors(tree)
        // })
    })
}
