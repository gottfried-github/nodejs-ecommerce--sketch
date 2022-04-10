import {testFilterErrors} from './product-validate_filter-errors.js'
import {testValidateBSON} from './product-validate_validateBSON.js'

describe("filterErrors", () => {
    testFilterErrors()
})

describe("_validateBSON", () => {
    testValidateBSON()
})
