// models/cart.js
const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

/* -------------------------------------------------------------------------- */
/*                               Item Sub‑schema                              */
/* -------------------------------------------------------------------------- */

const CartItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Dish", required: true },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false } // use product id as unique key
);

/* -------------------------------------------------------------------------- */
/*                                  Cart Schema                               */
/* -------------------------------------------------------------------------- */

const CartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: { type: [CartItemSchema], default: [] },
  },
  { timestamps: true }
);

/* --------------------------- Virtual Properties --------------------------- */

CartSchema.virtual("totalQty").get(function () {
  return this.items.reduce((sum, item) => sum + item.qty, 0);
});

CartSchema.virtual("subtotal").get(function () {
  return this.items.reduce((sum, item) => sum + item.qty * item.price, 0);
});

/* -------------------------------- Indexes --------------------------------- */

CartSchema.index({ user: 1 });

const Cart = mongoose.model("Cart", CartSchema);

/* -------------------------------------------------------------------------- */
/*                         Get or Create Cart Helper                          */
/* -------------------------------------------------------------------------- */

const getOrCreateCart = async (userId) => {
  try {
    // 1. Find or create cart & populate dish data
    let cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product", // reference field
      select: "name price", // fetch only what you need
    });

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
      await cart.populate({ path: "items.product", select: "name price" });
    }

    // 2. Convert to plain object & slim items (optional)
    const result = cart.toObject({ getters: true, virtuals: true });

    result.items = result.items.map((it) => ({
      _id: it._id,
      product: it.product._id, // dish id
      name: it.product.name,
      price: it.product.price,
      qty: it.qty,
    }));

    return { code: 200, result };
  } catch (err) {
    console.error("getOrCreateCart error:", err);
    return { code: 500, result: "Could not retrieve cart" };
  }
};

const addItemToCart = async (userId, productId) => {
  try {
    /* ------------------------------------------------------------ *
     * 1. Get (or create) the cart document                         *
     * ------------------------------------------------------------ */
    let cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "name price",
    });

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
      await cart.populate({ path: "items.product", select: "name price" });
    }

    /* ------------------------------------------------------------ *
     * 2. Update the items array                                    *
     * ------------------------------------------------------------ */
    const existing = cart.items.find((i) => i.product._id.equals(productId));

    if (existing) {
      existing.qty += 1;
    } else {
      cart.items.push({ product: productId, qty: 1 });
    }

    await cart.save();

    /* ------------------------------------------------------------ *
     * 3. Re-populate to ensure updated product info                *
     * ------------------------------------------------------------ */
    await cart.populate({ path: "items.product", select: "name price" });

    /* ------------------------------------------------------------ *
     * 4. Convert to plain object and flatten items                 *
     * ------------------------------------------------------------ */
    const plain = cart.toObject({ getters: true, virtuals: true });

    plain.items = plain.items.map((item) => ({
      product: item.product?._id,
      name: item.product?.name,
      price: item.product?.price,
      qty: item.qty,
    }));

    return {
      code: 200,
      result: plain,
    };
  } catch (err) {
    console.error("addItem error:", err);
    return {
      code: 500,
      result: "Server error while adding item to cart",
    };
  }
};

const removeItemFromCart = async (userId, productId) => {
  try {
    /* ------------------------------------------------------------ *
     * 1. Get the user's cart and populate product info             *
     * ------------------------------------------------------------ */
    let cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "name price",
    });

    if (!cart) {
      return {
        code: 404,
        result: "Cart not found",
      };
    }

    /* ------------------------------------------------------------ *
     * 2. Find the item and decrement qty or remove                 *
     * ------------------------------------------------------------ */
    const itemIndex = cart.items.findIndex((i) =>
      i.product._id.equals(productId)
    );

    if (itemIndex === -1) {
      return {
        code: 404,
        result: "Product not found in cart",
      };
    }

    const item = cart.items[itemIndex];

    if (item.qty > 1) {
      item.qty -= 1;
    } else {
      cart.items.splice(itemIndex, 1); // remove item completely
    }

    await cart.save();

    /* ------------------------------------------------------------ *
     * 3. Re-populate and format response                           *
     * ------------------------------------------------------------ */
    await cart.populate({ path: "items.product", select: "name price" });

    const plain = cart.toObject({ getters: true, virtuals: true });

    plain.items = plain.items.map((item) => ({
      product: item.product?._id,
      name: item.product?.name,
      price: item.product?.price,
      qty: item.qty,
    }));

    return {
      code: 200,
      result: plain,
    };
  } catch (err) {
    return {
      code: 500,
      result: "Server error while removing item from cart",
    };
  }
};

const clearCartForUser = async function (userId) {
  try {
    await Cart.findByIdAndDelete(userId);
    return {
      code: 404,
      result: "User Deleted successfully",
    };
  } catch (error) {
    return {
      code: 500,
      result: "Server error while removing item from cart",
    };
  }
};

/* -------------------------------------------------------------------------- */
/*                                   Export                                   */
/* -------------------------------------------------------------------------- */
module.exports = Cart;
module.exports.getOrCreateCart = getOrCreateCart;
module.exports.addItemToCart = addItemToCart;
module.exports.removeItemFromCart = removeItemFromCart;
module.exports.clearCartForUser = clearCartForUser;
