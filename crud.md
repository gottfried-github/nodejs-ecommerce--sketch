# Specification
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
