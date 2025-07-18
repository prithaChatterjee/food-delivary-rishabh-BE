const mongoose = require("mongoose");

const resturentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
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
  const result = await Resturent.find()
    .populate({
      path: "location",
      populate: {
        path: "city",
        match: { _id: search.categories }, // filter by matched city
      },
    });
  return result.filter((r) => r.location?.city);
};

const getresturentsByUser = async function (user) {
  try {
    const result = await Resturent.find({ seller: user })
      .populate({
        path: "location",
        populate: {
          path: "city",
        },
      });
    return { code: 200, result };
  } catch (error) {
    return { code: 400, result: error };
  }
};

const getresturentsById = async function (id) {
  try {
    const result = await Resturent.findById(id);
    return { code: 200, result };
  } catch (error) {
    return { code: 400, result: error };
  }
};

const createresturents = async function (req) {
  const body = req.body
  const user = req.user._id
  try {
    const resturent = new Resturent({...body, seller: user});
    const response = await resturent.save();
    return { code: 200, result: response };
  } catch (error) {
    return { code: 400, result: error };
  }
};

const deleteResturent = async (id) => {
  try {
    const updatedDish = await Resturent.findByIdAndDelete(id, {
      new: true,
      runValidators: true,
    })

    if (!updatedDish) {
      return { code: 404, result: "Resturent not found" };
    }

    return { code: 200, result: updatedDish };
  } catch (error) {
    return { code: 400, result: error.message || "Something went wrong" };
  }
};

module.exports.createresturent = createresturents;
module.exports.getresturents = getresturents;
module.exports.getresturentsByUser = getresturentsByUser;
module.exports.getresturentsById = getresturentsById;
module.exports.deleteResturent = deleteResturent;
