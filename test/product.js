import {testUpdate} from './product_update.js'
import {testCreate} from './product_create.js'
import {testGetById} from './product_getById.js'

describe("_update", () => {
    testUpdate()
})

describe("_create", () => {
    testCreate()
})

describe("_getById", () => {
    testGetById()
})
