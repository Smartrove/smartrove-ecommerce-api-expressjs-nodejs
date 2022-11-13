const express = require("express");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenByAdmin,
} = require("./verifyToken");
const router = express.Router();
const Order = require("../models/Order");

//http://localhost:5000/api/ecommerce/v1/order/

//create product
//any user can create his own order
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update user
//only admin can update order
router.put("/:id", verifyTokenByAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete Product
//only admin can delete order
router.delete("/:id", verifyTokenByAdmin, async (req, res) => {
  try {
    const orderDeleted = await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});
//get user single Order
//user can get his order
router.get("/get/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});
//get all Orders
//only admin can get all orders
router.get("/", verifyTokenByAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get monthly income
router.get("/income", verifyTokenByAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      { $project: { month: { $month: "createdAt" } }, sales: "$amount" },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
