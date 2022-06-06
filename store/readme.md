# E-commerce mongodb storage
`mongodb` storage for an e-commerce. Implements the interface, defined [here](https://github.com/gottfried-github/nodejs-ecommerce--sketch#crud).

# Usage
## Install
`npm install --save mongodb bazar-mongo`

`npm install --save-dev migrate-mongo`

## Setup
Start a mongodb instance.

### Apply migrations
#### Point `migrate-mongo` to the migrations directory
In `migrate-mongo-config.js`, in the `migrationsDir` field, set this: `./node_modules/bazar-mongo/migrations`.

#### Up
Then, use: `migrate-mongo up` with the config file.

### Initialize the store
```javascript
import {MongoClient, ObjectId} from 'mongodb'
import Store from 'bazar-mongo'

const client = new MongoClient(/*mongo connection uri*/)
client.connect()

const store = Store(client.db(/*db name*/), client)

crudProduct(store.product)

async function crudProduct(product) {
  const id = await product.create({isInSale: true, name: "Iphone X", itemInitial: new ObjectId().toString()})

  const doc = await product.getById(id)

  await product.delete(id)
}
```

# Test
`npm run test`
