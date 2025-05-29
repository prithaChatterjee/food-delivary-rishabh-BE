const express = require('express')
const router = express.Router()
const {createcategories, getcategoriess} = require("../Models/categories")
const asyncMiddleware = require("../Middleware/asyncMiddleware")

router.get('/' , asyncMiddleware(async function (req, res) {
    const result = await getcategoriess()
    res.status(200).send(result)
}))

router.post('/', asyncMiddleware(async function (req, res) {
    const { code, result } = await createcategories(req.body)
    res.status(code).send(result)
}))

module.exports = router