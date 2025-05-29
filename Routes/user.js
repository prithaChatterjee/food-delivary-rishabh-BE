const express = require("express")
const asyncMiddleware = require("../Middleware/asyncMiddleware")
const { createUser, loginUser } = require("../Models/user")
const router = express.Router()

router.post("/", asyncMiddleware(async function (req, res) {
    const { code, result, token } = await createUser(req.body)
    res.header("x-auth-token", token).status(code).send(result)
}))

router.post("/login", asyncMiddleware(async function (req, res) {
    if (!req.body) return res.send("Can't find email")
    const { email, password } = req.body
    if (!email) return res.send("Can't find email")
    if (!password) return res.send("Can't find password")
    const { code, result, token } = await loginUser(req.body)
    res.header("x-auth-token", token).status(code).send(result)
}))

module.exports = router