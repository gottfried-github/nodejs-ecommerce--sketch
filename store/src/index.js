import * as m from './messages.js'
import Product from './product/index.js'

function BazarMongo(db, client) {
    // first, validate db (see 'BazarMongo: validating the passed database')

    const product = Product(db.collection('product'))

    return {product}
}

export default BazarMongo
