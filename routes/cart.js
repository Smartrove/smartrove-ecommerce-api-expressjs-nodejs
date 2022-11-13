const express = require("express");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenByAdmin,
} = require("./verifyToken");
const router = express.Router();
const Cart = require("../models/Cart");

//http://localhost:5000/api/ecommerce/v1/cart/

//create product
//any user can create his own cart
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update user
//user can update his own cart
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete Product
//user can delete his own cart
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cartDeleted = await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Cart deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});
//get user single Cart
//user can get his cart
router.get("/get/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});
//get all Cart
//authentication is not needed here because everybody can access this.
//query url
//http://localhost:5000/api/ecommerce/v1/product/get?category=Woman
router.get("/", verifyTokenByAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
