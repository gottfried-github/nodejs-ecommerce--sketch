import * as m from 'bazar-api/app/src/messages.js'
import {product} from './product.js'

function BazarMongo(db, client, options) {
    const product = Product(db.collection(options?.collectionNames?.product || 'product'))

    return {product}
}

export default BazarMongo
