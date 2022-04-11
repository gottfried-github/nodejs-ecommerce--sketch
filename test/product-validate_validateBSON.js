import {bsonValidateData} from "./product-validate_BSON-validate-data.js"
import {_validateBSON} from '../src/_product-validate.js'

function testValidateBSON() {
    bsonValidateData(_validateBSON)
}


export {testValidateBSON}
