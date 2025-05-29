const express = require('express')
const router = express.Router()
const {createdish, getdishes} = require("../Models/dishes")
const asyncMiddleware = require("../Middleware/asyncMiddleware")

router.get('/:_id' , asyncMiddleware(async function (req, res) {
    // console.log(req.params)
    // console.log(req.query.search)
    const result = await getdishes({[req.query.search]: req.params._id})
    res.status(200).send(result)
}))

router.post('/', asyncMiddleware(async function (req, res) {
    const { code, result } = await createdish(req.body)
    res.status(code).send(result)
}))

module.exports = router