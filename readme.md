# Description
A modular e-commerce application, implementing the specification, defined [here](#data-structure).

**Note:** this is a *sketch*, which means it doesn't even work yet - apart from the controllers in `store`, which you can [test](#test-store).

# Api
## Function
### Inward
Api transmits the received data over to the store. In doing so, it should make sure that:
1. fields, defined [here](#data-structure) exist in the received data
2. the values are of the correct type
3. fields, not defined in the [spec](#data-structure), don't exist

### Outward
Assign status codes and messages to the output of the store and send it in response to the client.

# Store
Store needs to implement the interface, defined [here](#crud).

# App
[The app](#) bundles everything together and deploys it.

# Test store
```bash
git clone <clone url>
cd <cloned directory>/store
npm run test
```

# Data structure
## Product
### Fields
    * `isInSale`: `boolean`
    * `name`: `string`
    * `itemInitial`: `a reference to an existing item`

### Additional conditions
    1. `isInSale` must be specified
    2. if `isInSale` is `true`: the other fields must also be specified

## Item
### Fields
    * `isInSale`: `boolean`
    * `price`: `number`
    * `qty`: `integer`
    * `size`: reference to `Size`
    * `color`: `a representation of rgb`
    * `photos`: `array, containing references to Photos`

### Additional conditions
    1. `isInSale` must be specified
    2. if `isInSale` is `true`: the other fields must also be specified

# CRUD
## Validation error format
`ajv-errors-to-data-tree`-formatted tree resembling the input data, with the errors being `ValidationError`, `FieldMissing`, `TypeErrorMsg`

## create
### parameters
  1. `fields`

### behavior
* **success**: return id of created document
* **validation failure**: throw validation error

Any other error shall be treated as an internal error.

## update
### parameters
  1. `id`
  2. `fields`

### behavior
  * **success**: return `true`
  * **invalid `id` or no document with given id**: throw `InvalidCriterion`
  * **validation failure**: throw validation error

Any other error shall be treated as an internal error.

## delete
### parameters
  1. `id`

### behavior
  * **success**: return `true`
  * **invalid `id` or no document with given id**: throw `InvalidCriterion`

Any other error shall be treated as an internal error.

## getById
### parameters
  1. `id`

### behavior
  * **success**: return the found document
  * **no document found**: return `null`
  * **invalid id**: throw `InvalidCriterion`

Any other error shall be treated as an internal error.
