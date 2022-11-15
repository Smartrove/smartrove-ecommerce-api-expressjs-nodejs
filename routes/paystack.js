const { response } = require("express");
const express = require("express");
const router = express.Router();
let paystack = require("paystack")(process.env.PAYSTACK_KEY);

router.post("/", (req, res) => {
  paystack.plan
    .create({
      name: "API demo",
      amount: 10000,
      interval: "monthly",
    })
    .then((error, success) => {
      if (error) {
        response.status(500).json({ message: "error" });
      } else {
        response.status(200).json({ message: "success" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

module.exports = router;
