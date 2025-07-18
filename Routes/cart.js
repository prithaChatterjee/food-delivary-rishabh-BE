// routes/cart.js
const express = require('express');
const asyncMiddleware = require('../Middleware/asyncMiddleware');
const auth = require('../Middleware/auth');
const {
  getOrCreateCart,
  addItemToCart,
  removeItemFromCart,
  clearCartForUser,
} = require('../Models/cart');

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                                GET CART                                    */
/* -------------------------------------------------------------------------- */
/**
 * GET /api/cart
 * Returns the current user's cart.
 */
router.get(
  '/',
  auth,
  asyncMiddleware(async (req, res) => {
    const { code, result } = await getOrCreateCart(req.user._id);
    res.status(code).send(result);
  })
);

/* -------------------------------------------------------------------------- */
/*                               ADD 1 ITEM                                   */
/* -------------------------------------------------------------------------- */
/**
 * POST /api/cart/items
 * Body: { productId, name, price }
 */
router.post(
  '/items',
  auth,
  asyncMiddleware(async (req, res) => {
    const { productId } = req.body;
    const { code, result } = await addItemToCart(req.user._id, productId);
    res.status(code).send(result);
  })
);

/* -------------------------------------------------------------------------- */
/*                               DECREMENT ITEM                               */
/* -------------------------------------------------------------------------- */
/**
 * PATCH /api/cart/items/:productId
 */
router.put(
  '/items/:productId',
  auth,
  asyncMiddleware(async (req, res) => {
    const { productId } = req.params;
    const { code, result } = await removeItemFromCart(req.user._id, productId);
    res.status(code).send(result);
  })
);

/* -------------------------------------------------------------------------- */
/*                               REMOVE ITEM                                  */
/* -------------------------------------------------------------------------- */
/**
 * DELETE /api/cart/items/:productId
 */
router.delete(
  '/items/:productId',
  auth,
  asyncMiddleware(async (req, res) => {
    const { productId } = req.params;
    const { code, result } = await removeItemFromCart(req.user._id, productId);
    res.status(code).send(result);
  })
);

/* -------------------------------------------------------------------------- */
/*                                 CLEAR CART                                 */
/* -------------------------------------------------------------------------- */
/**
 * DELETE /api/cart
 */
router.delete(
  '/',
  auth,
  asyncMiddleware(async (req, res) => {
    const { code, result } = await clearCartForUser(req.user._id);
    res.status(code).send(result);
  })
);

module.exports = router;
