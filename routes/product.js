const express = require("express");
const {
  verifyTokenAndAuthorization,
  verifyTokenByAdmin,
} = require("./verifyToken");
const router = express.Router();
const Product = require("../models/Product");

//http://localhost:5000/api/ecommerce/v1/product/

//create product
router.post("/", verifyTokenByAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update user
router.put("/:id", verifyTokenByAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete Product

router.delete("/:id", verifyTokenByAdmin, async (req, res) => {
  try {
    const productDeleted = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});
//get single Product
//authentication is not needed here because everybody can access this.
router.get("/get/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});
//get all Product
//authentication is not needed here because everybody can access this.
//query url
//http://localhost:5000/api/ecommerce/v1/product/get?category=Woman
router.get("/get/", async (req, res) => {
  //query to return last new five users
  const newQuery = req.query.new;
  const categoryQuery = req.query.category;
  try {
    let products;
    if (newQuery) {
      products = await Product.find().sort({ created: -1 }).limit(1);
    } else if (categoryQuery) {
      products = await Product.find({
        categories: {
          $in: [categoryQuery],
        },
      });
    } else {
      products = await Product.find();
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
