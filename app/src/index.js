import express from 'express'
import {MongoClient} from 'mongodb'

import {api as _api} from '../api/index.js'
import {store as _store} from '../store/index.js'

function main(port) {
    /* connect to database */
    if (!process.env.APP_DB_NAME || !process.env.APP_DB_USER || !process.env.APP_DB_PASS) throw new Error('all of the database connection parameters environment variables must be set')

    const client = new MongoClient(`mongodb://${process.env.APP_DB_USER}:${process.env.APP_DB_PASS}@e-shop-n/${process.env.APP_DB_NAME}`)
    client.connect()

    /* initialize store and api */
    const store = _store(client.db(process.env.APP_DB_NAME), client)
    const api = _api(store)

    const app = express()
    app.use(api)

    /* start server */
    const server = app.listen(port)

    return {app, server}
}
