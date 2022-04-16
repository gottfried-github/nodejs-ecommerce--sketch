import * as m from 'bazar-api/app/src/messages.js'
import {Product} from './product.js'

function BazarMongo(db, client) {
    // first, validate db (see 'BazarMongo: validating the passed database')

    const product = Product(db.collection('product'))

    return {product}
}

export default BazarMongo
