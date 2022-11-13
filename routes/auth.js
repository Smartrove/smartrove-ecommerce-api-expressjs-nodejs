const express = require("express");
const { restart } = require("nodemon");
const router = express.Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//http://localhost:5000/api/ecommerce/v1/user
//everything concerning our login and register here!!!
//the user model must be imported

//register
router.post("/register", async (req, res) => {
  const newUser = await new User({
    username: req.body.username,
    email: req.body.email,
    //password should be encrypted before been saved to database
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//login the user
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });
    !user && response.status(401).json("wrong credentials!");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_KEY
    );

    var password = hashedPassword.toString(CryptoJS.enc.Utf8);
    password !== req.body.password &&
      response.status(401).json("wrong credentials!");

    //after the login process is complete, then jwt authentication
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_KEY,
      { expiresIn: "3d" }
    );

    //password should not be send to the frontend else
    var { password, ...others } = user._doc;
    //if username and password is correct
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json({ msg: "wrong credentials!" });
  }
});

module.exports = router;
