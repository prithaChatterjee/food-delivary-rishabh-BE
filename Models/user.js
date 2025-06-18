const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken")
const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.methods.generateToken = function(){
    const token = jwt.sign({ _id: this._id }, config.get("jwt"))
    return token
}

userSchema.statics.findUserDetails = async (body) => {
    const finduser = await User.findOne(body)
    return finduser
}

const User = mongoose.model("User", userSchema)

const createUser = async function (body) {
    try {
        const salt = await bcrypt.genSalt(15)
        body.password = await bcrypt.hash(body.password, salt)
        const user = new User(body)
        const result = await user.save()
        const token = new User(result).generateToken()
        return { code: 200, result, token }
    } catch (error) {
        return { code: 400, result: error }
    }
}

const loginUser = async function (body) {
    const { email, password } = body
    const user = await User.findUserDetails({ email })
    if (!user) return { code: 400, result: "InValid Credential" }
    const login = await bcrypt.compare(password, user.password)
    if (!login) return { code: 400, result: "InValid Credential" }
    const token = new User(user).generateToken()
    return { code: 200, result: user, token }
}


module.exports.createUser = createUser
module.exports.loginUser = loginUser
module.exports.User = User