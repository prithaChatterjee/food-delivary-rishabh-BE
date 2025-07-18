const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const validator = require("validator");

// 🔹 Address Sub-schema
const addressSchema = new mongoose.Schema(
  {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
  },
  { _id: false }
);

// 🔹 Validator for complete or empty address
function isCompleteAddress(val) {
  if (!val) return true;
  const { street, city, state, zip } = val;
  const isEmpty = !street && !city && !state && !zip;
  const isComplete = street && city && state && zip;
  return isEmpty || isComplete;
}

// 🔹 Main User Schema
const userSchema = new mongoose.Schema({
  name: { type: String },

  email: {
    type: String,
    unique: true,
    required: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },

  phone: {
    type: String,
    unique: true,
    sparse: true,
    validate: {
      validator: function (value) {
        if (!value) return true;
        return validator.isMobilePhone(value, "en-IN");
      },
      message: "Invalid Indian mobile number",
    },
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["seller", "buyer"],
    default: "buyer",
  },

  preference: {
    type: String,
    enum: ["veg", "nonveg", "both"],
    default: "both",
  },

  address: {
    type: addressSchema,
    validate: {
      validator: isCompleteAddress,
      message: "Address must include street, city, state, and zip if provided.",
    },
  },
});

// 🔹 Instance Method: Generate JWT
userSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, config.get("jwt"));
};

// 🔹 Static Method: Find user
userSchema.statics.findUserDetails = async (body) => {
  return await User.findOne(body);
};

// 🔹 Model
const User = mongoose.model("User", userSchema);

// 🔹 Create user
const createUser = async (body) => {
  try {
    const salt = await bcrypt.genSalt(15);
    body.password = await bcrypt.hash(body.password, salt);

    const user = new User(body);
    const result = await user.save();
    const token = user.generateToken();

    const userObj = result.toObject();
    delete userObj.password;

    return { code: 200, result: userObj, token };
  } catch (error) {
    return { code: 400, result: error.message || error };
  }
};

// 🔹 Login user
const loginUser = async (body) => {
  const { email, password } = body;

  const user = await User.findUserDetails({ email });
  if (!user) return { code: 400, result: "Invalid Credential" };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return { code: 400, result: "Invalid Credential" };

  const token = user.generateToken();
  const userObj = user.toObject();
  delete userObj.password;

  return { code: 200, result: userObj, token };
};

// 🔹 Edit user
const editUser = async (id, body) => {
  try {
    const disallowedFields = ["_id", "email", "password"];
    for (let key of disallowedFields) {
      if (key in body) {
        return { code: 400, result: `Cannot update field: ${key}` };
      }
    }

    const user = await User.findById(id);
    if (!user) return { code: 404, result: "User not found" };

    if (body.name !== undefined) user.name = body.name;
    if (body.phone !== undefined) user.phone = body.phone;
    if (body.preference !== undefined) user.preference = body.preference;

    if (body.address !== undefined) {
      const { street, city, state, zip } = body.address;
      const isEmpty = !street && !city && !state && !zip;
      const isComplete = street && city && state && zip;

      if (isComplete || isEmpty) {
        user.set("address", isEmpty ? undefined : body.address);
        user.markModified("address");
      } else {
        return {
          code: 400,
          result: "Please provide all address fields: street, city, state, and zip.",
        };
      }
    }

    const updatedUser = await user.save();
    const userObj = updatedUser.toObject();
    delete userObj.password;

    const token = user.generateToken();

    return { code: 200, result: userObj, token };
  } catch (error) {
    return { code: 400, result: error.message || "Error updating user" };
  }
};

// 🔹 Exports
module.exports = {
  createUser,
  loginUser,
  editUser,
  User,
};
