# Validation
## Criteria
See `'Additional conditions' in 'Structure/Product' in e-shop docs` for what the validation should implement.

## Which errors should not occur in the data
`bazar-api` is expected to pass only the fields, defined in the specification. If any other fields are present, then we should throw (like we would, for example, if data of wrong type is passed to a function in a program).

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

### Machine-readable errors with ajv
#### Some problems
When data violates one of the schemas in `oneOf`, errors for every schema are generated (see `~/basement/house/test/ajv_oneOf` readme).
Let's consider the case of the product schema.
1. case data: `{}`, `{isInSale: 5}` (see `empty` and `invalid`). Both these data will have:
    1. `name`: `required`
    2. `itemInitial`: `required`

We've established, in `'Which errors to report'`, that in a case like this, we don't want to report the `required` errors.
2. Additionally, with `{isInSale: true, name: 'a name'}`, `isInSale` will still have an `enum` error, from the second schema in `oneOf`.

3. `{isInSale: true, name: 5}`. This will have a `required` error for `itemInitial`.

#### Some observations
Both schemas are identical except of:
    1. the value of the `enum` keyword for `isInSale`; and
    2. the `name` and `itemInitial` fields being `required`

So, whenever an error occurs, there will be identical errors for each of the schemas, except that
    1. there will be no `required` errors for `name` and `itemInitial` (because of `2` from above) from the second schema and,
    2. if `isInSale` satisfies one of the schemas, there will be no `enum` error for that schema (because of `1` from above).

#### Filtering out irrelevant errors
1. In case if `isInSale` is invalid or missing: the `required` errors for the other fields are irrelevant - see `'Which errors to report'`; all the other errors will be identical for each of the schemas -- so we can
    1. ignore the `required` errors for the other fields and
    2. arbitrarily pick any schema and ignore errors from all the other ones
    3. additionally, we can ignore `enum` errors for `isInSale` (which is the only field these errors are possible for), because that keyword is used to make a logical distinction, based on which to choose schema, not to actually specify allowed values
2. If `isInSale` satisfies one of the schemas, then the schema which doesn't have the `enum` error for `isInSale` is the appropriate schema.

## Type-validating `itemInitial` in `_validate`
An `objecId` can actually be not only a string. For example, if I pass to `validate` an `itemInitial` of an instance of `ObjectId`, it will return a type error. The same will happen for any of the other types, acceptable by `ObjectId`. To avoid this, I should not set the `string` type restriction.

# Setup
## The role of `migrate-mongo` in this project
I only use the `create` command to create migration files. This doesn't seem to be connecting to the database, and using the `url` option in the config. So I commented it out entirely.

# References
## Behavior of the schema, defined in the `20220409125303-product-schema.js`
See `~/basement/house/test/bazar-product-schema-mongodb` for examples of behavior for different data.

# Testing output separately from input
Tests are first and foremost about the *output* of a component, not necessarily about it's *input*: there could be different components taking different input and generating the same output and the output of all such components should be validated against the same code.
Of course, a concrete component has to be tested to generate specific outputs for specific inputs.
## Example
For a certain input data, both `validate` and `_validateBSON` should return a single error - a BSONTypeError - regarding `itemInitial`. But the former should return it for `{isInSale: false, itemInitial: "an invalid id"}` or alike - while the latter will return it for, say `{itemInitial: "an invalid id"}`. In both cases the output is the same, but the input is different.
Right now, `validate` doesn't pass the last two tests from `JSON-valid but BSON-invalid` because the data passed in is actually not JSON-valid.

# `_product-validate`, testing `validate`
If we've tested the dependencies, we don't need to inject fake ones to test `validate`: we just need to make sure that:
    1. if data violates JSON rules, it returns errors, that pass the same tests as errors, returned by `filterErrors` do
    2. if data violates BSON rules, the corresponding errors are the same as `validateBSON` would return
    3. if data includes fields, not defined in the spec, it throws an error

But mainly, we have to make sure that it returns proper errors for data, violating a mixture of JSON and BSON rules.

# `_product-validate`, testing `_validateBSON`
The method is private, it's meant to be used by `validate`, which JSON-validate the data before passing it to the method. Henceforth, I only provide cases involving `itemInitial`. I compare the returned error (if any) with an error, generated for the same input by `mongodb` `ObjectId`.

# `_product-validate`, `_validateBSON`: handle non-existing `itemInitial`
In `validate`, I don't check whether `itemInitial` is present in the fields before passing them to `_validateBSON`, because which fields should be validated against BSON is not the concern of `validate`: it's the concern of `_validateBSON`. Henceforth, `_validateBSON` should handle it itself. Before it handled it implicitly, because `ObjectId` just generates a new id if passed `undefined` or `null`. But handling it explicitly makes the code a bit more accessible.
## What if `itemInitial` is set, but is `null` or `undefined`?
Again, `ObjectId` simply generates a new id if passed either of those - hence generating no error. But for the case that `_validateBSON` is designed for this is not appropriate: `itemInitial` must be an existing value, that should be a valid `objectId`. But, `_validateBSON` is a private method, used only by `validate`, which makes sure that `itemInitial`, if any, is a string, before passing the fields to `_validateBSON`.
