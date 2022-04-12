import {ObjectId} from 'mongodb'

import {testBSONErrors} from './product-validate_testBSONErrors.js'
import {_validateBSON} from '../src/_product-validate.js'

const id = "an invalid id"

function testValidateBSON() {
    const tests = {
        singleCorrectError: [
            {
                i: [{itemInitial: id}],
                o: _validateBSON,
                description: "itemInitial is an invalid string objectId"
            }
        ],
        returnsNull: [
            {
                i: [{itemInitial: new ObjectId().toString()}],
                o: _validateBSON,
                description: "itemInitial is a valid string objectId"
            },
            {
                i: [{}],
                o: _validateBSON,
                description: "itemInitial not set"
            }
        ]
    }

    testBSONErrors(tests)
}

export {testValidateBSON}
