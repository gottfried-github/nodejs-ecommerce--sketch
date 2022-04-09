# Validation
## Criteria
See `'Additional conditions' in 'Structure/Product' in e-shop docs` for what the validation should implement.

## Which errors to report
Consider the case: `{
    isInSale: 5,
    name: 10
}`.
If `isInSale` is invalid, the document is invalid regardless whether other fields are valid or not. Does this mean that I should only report the `isInSale` error? I guess no, because if I do, the user can correct both errors and if I don't, she will need two iterations.
For the given case, should I report a `required` error on the `itemInitial`? For the field to be required, `isInSale` must be `true`. But here we don't know whether user intended it to be `true` or `false`. Thus, we don't know if `itemInitial` is ought to be `required`.
So, if `isInSale` is invalid or missing, we should report any errors regarding the other fields, except the `required` errors.

## Parsing the errors
In `mongodb` builtin jsonSchema validation, ["The error output ... should not be relied upon in scripts."](https://docs.mongodb.com/manual/core/schema-validation/).
To sidestep this I can use an independent jsonschema validation lib like `ajv` to generate machine-readable errors. However there are some potential pitfalls to that.
    1. `mongodb` validation implements the `draft-4` jsonschema standard, whereas `ajv` doesn't support that, it's default standard is `draft-7`.
    2. in `mongodb`, I actually validate against `BSON` types, not against `JSON` ones: the `BSON` types include things like `objectId`, which there's no way to validate with `ajv`.
`1.` is not an issue in the case of the `oneOf` keyword, since the keyword's definition hasn't changed between the two standards.
`2.` the solution is to manually validate the appropriate fields, using the `bson` library.

## Machine-readable errors with ajv
### Some problems
When data violates one of the schemas in `oneOf`, errors for every schema are generated (see `~/basement/house/test/ajv_oneOf` readme).
Let's consider the case of the product schema.
1. case data: `{}`, `{isInSale: 5}` (see `empty` and `invalid`). Both these data will have:
    1. `name`: `required`
    2. `itemInitial`: `required`

We've established, in `'Which errors to report'`, that in a case like this, we don't want to report the `required` errors.
2. Additionally, with `{isInSale: true, name: 'a name'}`, `isInSale` will still have an `enum` error, from the second schema in `oneOf`.

3. `{isInSale: true, name: 5}`. This will have a `required` error for `itemInitial`.

### Some observations
Both schemas are identical except of:
    1. the value of the `enum` keyword for `isInSale`; and
    2. the `name` and `itemInitial` fields being `required`

So, whenever an error occurs, there will be identical errors for each of the schemas, except that
    1. there will be no `required` errors for `name` and `itemInitial` (because of `2` from above) from the second schema and,
    2. if `isInSale` satisfies one of the schemas, there will be no `enum` error for that schema (because of `1` from above).

### Filtering out irrelevant errors
1. In case if `isInSale` is invalid or missing: the `required` errors are irrelevant - see `'Which errors to report'`; all the other errors will be identical for each of the schemas -- so we can
    1. ignore the `required` errors and
    2. arbitrarily pick any schema and ignore errors from all the other ones.
2. If `isInSale` satisfies one of the schemas, then the schema which doesn't have the `enum` error for `isInSale` is the appropriate schema.

# Setup
## The role of `migrate-mongo` in this project
I only use the `create` command to create migration files. This doesn't seem to be connecting to the database, and using the `url` option in the config. So I commented it out entirely.

# References
## Behavior of the schema, defined in the `20220409125303-product-schema.js`
See `~/basement/house/test/bazar-product-schema-mongodb` for examples of behavior for different data.
