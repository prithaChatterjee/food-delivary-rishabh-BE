const jwt = require("jsonwebtoken")
const config = require("config")
module.exports = function auth(req, res, next) {
    const token = req.header("x-auth-token")
    if (!token) return res.status(400).send("Please login")
    try {
        const user = jwt.verify(token, config.get("jwt"))
        req.user = user._id
        next()
    } catch (error) {res.send(error)}
}