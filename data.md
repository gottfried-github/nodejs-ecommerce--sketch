# Product
## Fields
    * `isInSale`: `boolean`
    * `name`: `string`
    * `itemInitial`: `a reference to an existing item`

## Additional conditions
    1. `isInSale` must be specified
    2. if `isInSale` is `true`: the other fields must also be specified

# Item
## Fields
    * `isInSale`: `boolean`
    * `price`: `number`
    * `qty`: `integer`
    * `size`: reference to `Size`
    * `color`: `a representation of rgb`
    * `photos`: `array, containing references to Photos`

## Additional conditions
    1. `isInSale` must be specified
    2. if `isInSale` is `true`: the other fields must also be specified
