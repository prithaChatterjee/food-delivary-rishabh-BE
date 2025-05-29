const config = require("config")

module.exports = function () {
    const jwt = config.get("jwt")
    if (!jwt) {
        console.log("jwt token isn't defined")
        process.exit(1)
    }
}