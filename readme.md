# Usage
## Install
`npm install --save mongodb bazar-mongo`
`npm install --save-dev migrate-mongo`

## Setup
### Set up mongodb instance
First, you have to setup your mongodb instance. For that, see `elsewhere`.

### Apply migrations
#### Point `migrate-mongo` to the migrations directory
In `migrate-mongo-config.js`, in the `migrationsDir` field, set this: `./node_modules/bazar-mongo/migrations`

### Initialize the store
```javascript
import {MongoClient} from 'mongodb'
import Store from 'bazar-mongo'

const client = new MongoClient(/*mongo connection uri*/)
client.connect()

const store = Store(client, client.db(/*db name*/))
```
