function Product(c) {
    return {
        create(fields) {
            console.log("createProduct, c:", c)
        }
    }
}

export default Product
