import * as m from 'bazar-api/app/src/messages.js'
import {Product} from './product.js'

function BazarMongo(db, client) {
    const product = Product(db.collection('product'))

    return {product}
}

export default BazarMongo
