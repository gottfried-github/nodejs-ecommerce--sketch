import {assert} from 'chai'

const jsonValidateData = {
    missingNoFields: {
        data: {},
        assert(res) {
            return assert(
                // tree.node only includes isInSale;
                1 === Object.keys(res.node).length && 'isInSale' in res.node

                // tree.node.isInSale only has one error;
                // the error keyword is 'required'
                && 1 === res.node.isInSale.errors.length && 'required' === res.node.isInSale.errors[0].data.keyword
            )
        },
        description: "ONLY a 'required' error for isInSale"
    },
    invalidNoFields: {
        data: {isInSale: 5},
        assert(res) {
            return assert(
                // tree.node only includes isInSale;
                1 === Object.keys(res.node).length && 'isInSale' in res.node

                // tree.node.isInSale only has one error;
                // the error keyword is 'type'
                && 1 === res.node.isInSale.errors.length && 'type' === res.node.isInSale.errors[0].data.keyword
            )
        },
        description: "ONLY a 'type' error for isInSale"
    },
    missingInvalidField: {
        data: {name: 5},
        assert(res) {
            // console.log("missingInvalidField, assert - res:", res);
            const keys = Object.keys(res.node)

            return assert(
                // tree.node only includes the two fields
                2 === keys.length && keys.includes('isInSale') && keys.includes('name')

                // each of the fields have one proper error
                && 1 === res.node.isInSale.errors.length && 'required' === res.node.isInSale.errors[0].data.keyword
                && 1 === res.node.name.errors.length && 'type' === res.node.name.errors[0].data.keyword
            )
        },
        description: "ONLY a 'required' error for isInSale and 'type' error for name"
    },
    invalidInvalidField: {
        data: {isInSale: 5, name: 5},
        assert(res) {
            const keys = Object.keys(res.node)

            return assert(
                // tree.node only includes the two fields
                2 === keys.length && keys.includes('isInSale') && keys.includes('name')

                // each of the fields have one proper error
                && 1 === res.node.isInSale.errors.length && 'type' === res.node.isInSale.errors[0].data.keyword
                && 1 === res.node.name.errors.length && 'type' === res.node.name.errors[0].data.keyword
            )
        },
        description: "ONLY a 'type' error for isInSale and 'type' error for name"
    },
    trueInvalidField: {
        data: {isInSale: true, name: 5},
        assert(res) {
            const keys = Object.keys(res.node)

            return assert(
                2 === keys.length && keys.includes('name') && keys.includes('itemInitial')

                && 1 === res.node.name.errors.length && 'type' === res.node.name.errors[0].data.keyword
                && 1 === res.node.itemInitial.errors.length && 'required' === res.node.itemInitial.errors[0].data.keyword
            )
        },
        description: "contains two errors: a 'type' error for name and a 'required' error for itemInitial"
    },
}

export {jsonValidateData}
