const express = require('express')
const router = express.Router()
const {createdish, getdishes, updatedishs, deletedish} = require("../Models/dishes")
const asyncMiddleware = require("../Middleware/asyncMiddleware")
const auth = require('../Middleware/auth')

router.get('/:_id' , asyncMiddleware(async function (req, res) {
    // console.log(req.params)
    // console.log(req.query.search)
    const result = await getdishes(req.params._id)
    res.status(200).send(result)
}))

router.post('/', auth, asyncMiddleware(async function (req, res) {
    const { code, result } = await createdish(req.body)
    res.status(code).send(result)
}))

router.put('/:_id', auth, asyncMiddleware(async function (req, res) {
    const { code, result } = await updatedishs(req.params._id, req.body)
    res.status(code).send(result)
}))

router.delete('/:_id', auth, asyncMiddleware(async function (req, res) {
    const { code, result } = await deletedish(req.params._id)
    res.status(code).send(result)
}))

module.exports = router