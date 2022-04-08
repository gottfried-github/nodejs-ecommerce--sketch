import {MongoClient} from 'mongodb'
import BazarMongo from '../../src/index.js'

function connect() {
    const client = new MongoClient('')
    return client.connect().then(() => client)
}

async function main() {
    const client = await connect()
    const store = BazarMongo(client.db('app'), client)

    // should log the client, preceeded by the phrase: 'createProduct, c:'
    store.product.create()
}
