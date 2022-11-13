const express = require("express");
const {
  verifyTokenAndAuthorization,
  verifyTokenByAdmin,
} = require("./verifyToken");
const router = express.Router();
const User = require("../models/User");

//http://localhost:5000/api/ecommerce/v1/user

//update user
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete user
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const userDeleted = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "user deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});
//get single user
router.get("/get/:id", verifyTokenByAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    var { password, ...others } = user._doc;
    //if username and password is correct
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});
//get all user
router.get("/get/", verifyTokenByAdmin, async (req, res) => {
  //query to return last new five users
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    //if username and password is correct
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user stats
router.get("/stats", async (req, res) => {
  const date = new Date();
  console.log(111, date);

  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  console.log(333, lastYear);

  // try {
  //   const data = await User.aggregate([
  //     { $match: { createdAt: { $gte: lastYear } } },
  //     {
  //       $project: {
  //         month: { $month: "createdAt" },
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: "$month",
  //         total: { $sum: 1 },
  //       },
  //     },
  //   ]);
  //   res.status(200).json(data);
  //   console.log(111, data);
  // } catch (err) {
  //   res.status(500).json(err);
  // }
  const userCount = await User.countDocuments();
  if (!userCount) {
    return res.status(500).send("cannot get user count");
  } else {
    return res.send({ NumberOfUsers: userCount });
  }
});

module.exports = router;
