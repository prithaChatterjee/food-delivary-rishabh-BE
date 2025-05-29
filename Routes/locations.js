const express = require('express')
const router = express.Router()
const {createlocation, getLocation} = require("../Models/locations")
const asyncMiddleware = require("../Middleware/asyncMiddleware")
const auth = require('../Middleware/auth')

router.get('/' , asyncMiddleware(async function (req, res) {
    const result = await getLocation()
    res.status(200).send(result)
}))

router.post('/', asyncMiddleware(async function (req, res) {
    const { code, result } = await createlocation(req.body)
    res.status(code).send(result)
}))

module.exports = router