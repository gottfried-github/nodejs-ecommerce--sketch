import {ObjectId} from 'mongodb'

import {testBSONErrors} from './product-validate_testBSONErrors.js'
import {_validateBSON} from '../src/_product-validate.js'

const id = "an invalid id"

function testValidateBSON() {
    const tests = {
        singleCorrectError: {
            i: [{itemInitial: id}],
            o: _validateBSON
        },
        returnsNull: [
            {
                i: [{itemInitial: new ObjectId().toString()}],
                o: _validateBSON
            },
            {
                i: [{}],
                o: _validateBSON
            }
        ]
    }

    testBSONErrors(tests)
}

export {testValidateBSON}
