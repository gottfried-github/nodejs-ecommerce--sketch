import {Router} from 'express'
import {product} from './routes/product.js'
import {errorHandler} from './error-handler.js'

function api(store) {
    const router = Router()

    /* setup routes */
    router.use('/product', product(store.product))

    /* central error handling */
    router.use(errorHandler)

    return router
}

export {api}
