import {validateObjectId, containsId} from './helpers.js'
import {validate} from './_product-validate.js'

import {
    _storeCreate, _storeUpdate, _storeGetById,
    _create, _update, _getById
} from './_product.js'

function Product(c) {
    function storeCreate(fields) {
        return _storeCreate(fields, {c})
    }

    function storeUpdate(id, fields) {
        return _storeUpdate(id, fields, {c})
    }

    function storeDelete(id) {
        return _storeDelete(id, {c})
    }

    function storeGetById(id) {
        return _storeGetById(id, {c})
    }

    return {
        async getById(id) {
            return _getById(id, {getById: storeGetById, validateObjectId})
        }

        async create(fields) {
            return _create(fields, {create: storeCreate, validate})
        }

        async update(id, fields) {
            return _update(id, fields, {update: storeUpdate, getById: storeGetById, validate, validateObjectId, containsId})
        }

        async delete(id) {
            return _delete(id, {storeDelete, validateObjectId})
        }
    }
}

export default Product
