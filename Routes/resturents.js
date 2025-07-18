const express = require('express')
const router = express.Router()
const {getresturents, createresturent, getresturentsByUser, getresturentsById, deleteResturent} = require("../Models/resturents")
const asyncMiddleware = require("../Middleware/asyncMiddleware")
const auth = require('../Middleware/auth')

router.get('/:_id' , asyncMiddleware(async function (req, res) {
    const result = await getresturents({[req.query.search]: req.params._id})
    res.status(200).send(result)
}))

router.get('/resturentById/:_id' , asyncMiddleware(async function (req) {
    const result = await getresturentsById(req.params._id)
    res.status(200).send(result)
}))

router.get('/', auth, asyncMiddleware(async function (req, res) {
    const { code, result } = await getresturentsByUser(req.user._id)
    res.status(code).send(result)
}))

router.post('/', auth, asyncMiddleware(async function (req, res) {
    const { code, result } = await createresturent(req)
    res.status(code).send(result)
}))

router.delete('/:_id', auth, asyncMiddleware(async function (req, res) {
    const { code, result } = await deleteResturent(req.params._id)
    res.status(code).send(result)
}))

module.exports = router