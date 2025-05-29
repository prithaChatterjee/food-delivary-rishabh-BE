const mongoose = require("mongoose")

const dishSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    price: {
        type: String,
        required: true,
        unique: true
    },
    rating: Number,
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories"
    }],
});

const Dish = mongoose.model("Dish", dishSchema)

const getdishes = async function (search) {
    const result = await Dish.find().populate({
        path: 'categories',
    })
    return result
}

const createdishs = async function (body) {
    try {
        const dish = new Dish(body);
        const response = await dish.save()
        return { code: 200, result: response }
    } catch (error) {
        return { code: 400, result: error }
    }
}

module.exports.createdish = createdishs
module.exports.getdishes = getdishes 
