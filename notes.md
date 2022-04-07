# Which errors to report
Consider the case: `{
    isInSale: 5,
    name: 10
}`.
If `isInSale` is invalid, the document is invalid regardless whether other fields are valid or not. Does this mean that I should only report the `isInSale` error? I guess no, because if I do, the user can correct both errors and if I don't, she will need two iterations.
For the given case, should I report a `required` error on the `itemInitial`? For the field to be required, `isInSale` must be `true`. But here we don't know whether user intended it to be `true` or `false`. Thus, we don't know if `itemInitial` is ought to be `required`.
So, if `isInSale` is invalid or missing, we should report any errors regarding the other fields, except the `required` errors.
