const mongoose = require("mongoose")

const categoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: Buffer
    }
});

const Categories = mongoose.model("Categories", categoriesSchema)

const getcategoriess = async function () {
    const result = await Categories.find()
    return result
}

const createcategoriess = async function (body) {
    try {
        let categories = new Categories(body); 
        const response = await categories.save()
        return {code: 200, result: response}
    } catch (error) {
        return {code: 400, result: error}
    }
}

module.exports.createcategories = createcategoriess
module.exports.getcategoriess = getcategoriess 
module.exports.Categories = Categories