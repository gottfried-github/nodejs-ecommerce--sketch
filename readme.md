# Bazar-mongo
`mongodb` storage for the `bazar` e-commerce. More concretely, this implements storage of data, defined in `Structure` in `bazar-api`.

# Usage
## Install
`npm install --save mongodb bazar-mongo`
`npm install --save-dev migrate-mongo`

## Setup
### Set up mongodb instance
First, you have to setup your mongodb instance. For that, see `demo/setup.md`.

### Apply migrations
#### Point `migrate-mongo` to the migrations directory
In `migrate-mongo-config.js`, in the `migrationsDir` field, set this: `./node_modules/bazar-mongo/migrations`.
#### Up
Then, use: `migrate-mongo up` with the config file.

### Initialize the store
```javascript
import {MongoClient} from 'mongodb'
import Store from 'bazar-mongo'

const client = new MongoClient(/*mongo connection uri*/)
client.connect()

const store = Store(client, client.db(/*db name*/))
```
