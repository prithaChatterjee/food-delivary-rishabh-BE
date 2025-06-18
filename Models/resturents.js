const mongoose = require("mongoose");

const resturentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  categories: {
    type: [
      new mongoose.Schema({
        rating: { type: Number },
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Categories",
        },
      }),
    ],
    minLength: 1,
  },
  location: {
    type: new mongoose.Schema({
      address: String,
      city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Locations",
      },
    }),
  },
});

const Resturent = mongoose.model("Resturent", resturentSchema);

const getresturents = async function (search) {
  console.log(search);
  const result = await Resturent.find()
    .populate({
      path: "categories",
      populate: {
        path: "category",
      },
    })
    .populate({
      path: "location",
      populate: {
        path: "city",
        match: { _id: search.categories }, // filter by matched city
      },
    });
  return result.filter((r) => r.location?.city);
};

const createresturents = async function (body) {
  try {
    const resturent = new Resturent(body);
    const response = await resturent.save();
    return { code: 200, result: response };
  } catch (error) {
    return { code: 400, result: error };
  }
};

module.exports.createresturent = createresturents;
module.exports.getresturents = getresturents;
