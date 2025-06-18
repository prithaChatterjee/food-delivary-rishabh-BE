const jwt = require("jsonwebtoken");
const config = require("config");
const { User } = require("../Models/user");

module.exports = async function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ message: "Authentication failed: Token missing" });
  }

  try {
    const decodeObj = jwt.verify(token, config.get("jwt"));
    const { _id } = decodeObj;

    const user = await User.findById(_id); // 👈 await here

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token", error: error.message });
  }
};
