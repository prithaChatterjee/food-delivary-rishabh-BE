const express = require('express')
const error = require("../Middleware/errorMiddleware")
const items = require("../Routes/items")
const user = require("../Routes/user")
const location = require("../Routes/locations")
const categories = require("../Routes/categories")
const resturents = require("../Routes/resturents")
const dishes = require("../Routes/dishes")


module.exports = function name(app) {
    app.use(express.json())
    app.use(`/api/items`, items)
    app.use(`/api/user`, user)
    app.use(`/api/locations`, location)
    app.use(`/api/categories`, categories)
    app.use(`/api/resturents`, resturents)
    app.use(`/api/dishes`, dishes)
    app.use(error)
}