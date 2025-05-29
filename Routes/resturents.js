const express = require('express')
const router = express.Router()
const {getresturents, createresturent} = require("../Models/resturents")
const asyncMiddleware = require("../Middleware/asyncMiddleware")

router.get('/:_id' , asyncMiddleware(async function (req, res) {
    // console.log(req.params)
    // console.log(req.query.search)
    const result = await getresturents({[req.query.search]: req.params._id})
    res.status(200).send(result)
}))

router.post('/', asyncMiddleware(async function (req, res) {
    const { code, result } = await createresturent(req.body)
    res.status(code).send(result)
}))

module.exports = router