import bodyParser from 'body-parser'
import {Router} from 'express'
import {createProduct, updateProduct, getProductById} from '../data/product.js'
import {productStripFields} from '../../helpers.js'

function ensureFields(body) {
    const fields = productStripFields(body)

    const errors = {}
    if ('isInSale' in fields && 'boolean' !== typeof fields.isInSale) errors.isInSale = [new TypeError("'isInSale' must be boolean")]
    if ('name' in fields && 'string' !== typeof fields.name) errors.name = [new TypeError("'name' must be a string")]
    if ('itemInitial' in fields && 'string' !== typeof fields.itemInitial) errors.itemInitial = [new TypeError("'name' must be a string")]

    if (Object.keys(errors).length) return {fields: null, errors}
    return {fields}
}

function ensureFieldsCreate(body) {
    if (!('isInSale' in body)) return {fields: null, errors: {isInSale: m.FieldMissing.create("'isInSale' must be specified")}}
    return ensureFields(body)
}

function ensureFieldsUpdate(body) {
    const fields = productStripFields(body)
    if (!Object.keys(fields).length) return {fields: null, errors: m.FieldMissing.create("at least one of the fields must be specified")}

    return ensureFields(body)
}

function handleUpdateMissingFields(e, req, res, next) {
    if (!e) return next()
    if (!('code' in e) || m.FieldMissing.code !== e.code) return next(e)
    res.status(400).json(e)
}

function makeEnsureFields(ensureFields) {
    return (req, res, next) => {
        const _res = ensureFields(req.body)
        console.log("makeEnsureFields-produced method, ensureFields _res:", _res)

        if (!_res.fields) {
            if (!_res.errors) return next(new Error("ensureFieldsCreate must return either fields or errors"))
            return next(_res.errors)
        }

        req.body.fields = _res.fields
        next()
    }
}

function product(product) {
    const router = Router()

    router.post('/create', bodyParser.json(), makeEnsureFields(ensureFieldsCreate), async (req, res, next) => {
        // console.log('/admin/product/create, body.fields:', req.body.fields)

        let doc = null
        try {
            doc = await product.create(req.body.fields)
        } catch(e) {
            return next(e)
        }

        res.status(201).json(doc)
        // res.send('/product-create: endpoint is not implemented yet')
    })

    // see '/api/admin/product:id' in notes for why I don't validate params.id
    router.post('/update/:id', bodyParser.json(), makeEnsureFields(ensureFieldsUpdate), async (req, res, next) => {
        let doc = null

        try {
            doc = await product.update(req.params.id, req.body.fields)
        } catch (e) {
            return next(e)
        }

        res.status(200).json(doc)
        // res.send('/product-update: endpoint is not implemented yet')
    }, handleUpdateMissingFields)
    
    router.post('/delete', (req, res) => {
        res.send('/product-delete: endpoint is not implemented yet')
    })

    // see '/api/admin/product:id' in notes for why I don't validate params.id
    router.get('/:id', async (req, res, next) => {
        // console.log('/api/admin/product/, req.query:', req.query);
        let product = null
        try {
            product = await product.getById(req.params.id)
        } catch(e) {
            return next(e)
        }

        res.status(200).json(product)
    })

    return router
}

export default router
