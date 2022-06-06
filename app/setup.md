# passwords
* username: admin; password: p98y23roiuh213
* username: app; password: jpiuh23r987y4g2

# network
the network name is: bazar-mongo_demo
the network alias is: bazar-mongo_demo-n

# keyfile path
`data/keyfile`

# generate a keyfile
https://docs.mongodb.com/manual/tutorial/deploy-replica-set-with-keyfile-access-control/#create-a-keyfile
```
openssl rand -base64 756 > <path-to-keyfile>
chmod 400 <path-to-keyfile>
```

# create the network
`docker network create <network-name>`

# Setup mongodb instance
## start mongo instance with a new replica set and the user admin, if not existing
creates the admin user, with the `root` role, which, among other things, contains the `userAdminAnyDatabase` role, which allows to change data (including password) of any user in any database.
`docker run --rm -v $PWD/data:/data/db -p 27017:27017 --network <network-name> --network-alias <network-alias> -e MONGO_INITDB_ROOT_USERNAME=<admin username> -e MONGO_INITDB_ROOT_PASSWORD=<admin password> mongo --replSet rs0 --keyFile /data/db/keyfile --bind_ip <network-alias> --dbpath /data/db`

## initialize the replica set and the app user
creates the app user with the following roles:
`readWrite`; `dbAdmin` - to be able to perform `collMod` on collections.
`./init.sh <admin password> <app password> <network name> <network alias>`

# run node on the network
From `app/`:
```
docker run -it --tty -v "$(pwd)":/app -w /app --network <network-name> node bash
```
## inside the running container, run node with these environment variables
`APP_DB_NAME=app APP_DB_USER=app APP_DB_PASS=jpiuh23r987y4g2 NET_NAME="bazar-mongo_demo-n" node index.js`

# Apply migrations
From the node container inside `app/`:
`APP_DB_NAME=app APP_DB_USER=app APP_DB_PASS=jpiuh23r987y4g2 node_modules/.bin/migrate-mongo up -f migrate-mongo-config.js`

<!-- ## es5 modules
With the `type: module` in `package.json`, `migrate-mongo` can't import the config file when it's `.js`: it has to be `.cjs`; yet neither can it find the default config file when it's `.cjs`; so I have to use the `-f` option, e.g.: `migrate-mongo status -f migrate-mongo-config.cjs`.
`APP_DB_NAME=app APP_DB_USER=app APP_DB_PASS=jpiuh23r987y4g2 node_modules/.bin/migrate-mongo status -f migrate-mongo-config.cjs` -->

# access the network from host machine
```
docker ps
# find container with IMAGE of "node" and copy it's ID (e.g., e28354082f09)

docker inspect e28354082f09
# in the output, find: NetworkSettings.Networks.mongodb-distinct.IPAddress (e.g., 172.20.0.3)

# in the browser, navigate to:
# 172.20.0.3:3000

# this trick is taken from: https://stackoverflow.com/a/56741737
```
