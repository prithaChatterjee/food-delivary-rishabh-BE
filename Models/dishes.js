const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  rating: Number,
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
    },
  ],
  resturent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resturents",
    index: 1,
  },
});

const Dish = mongoose.model("Dish", dishSchema);

// 🔹 Get dishes by restaurant with populated categories
const getdishes = async function (resturent) {
  const result = await Dish.find({ resturent }).populate("categories");
  return result;
};

// 🔹 Create new dish and return with populated categories
const createdishs = async function (body) {
  try {
    const dish = new Dish(body);
    await dish.save();

    // Populate categories after saving
    const populatedDish = await Dish.findById(dish._id).populate("categories");

    return { code: 200, result: populatedDish };
  } catch (error) {
    return { code: 400, result: error };
  }
};

// 🔹 Update dish and return with populated categories
const updatedishs = async (id, body) => {
  try {
    const updatedDish = await Dish.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).populate("categories");

    if (!updatedDish) {
      return { code: 404, result: "Dish not found" };
    }

    return { code: 200, result: updatedDish };
  } catch (error) {
    return { code: 400, result: error.message || "Something went wrong" };
  }
};

const deletedish = async (id) => {
  try {
    const updatedDish = await Dish.findByIdAndDelete(id, {
      new: true,
      runValidators: true,
    }).populate("categories");

    if (!updatedDish) {
      return { code: 404, result: "Dish not found" };
    }

    return { code: 200, result: updatedDish };
  } catch (error) {
    return { code: 400, result: error.message || "Something went wrong" };
  }
};

module.exports = {
  createdish: createdishs,
  getdishes,
  updatedishs,
  deletedish
};
