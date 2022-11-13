const express = require("express");
const app = express();
const dotenv = require("dotenv/config");
const mongoose = require("mongoose");
const url = process.env.URL;
const port = process.env.PORT;

//import my router from the routes folder.
const UserRouter = require("./routes/user");
const AuthRouter = require("./routes/auth");
const ProductRouter = require("./routes/product");
const CartRouter = require("./routes/cart");
const OrderRouter = require("./routes/order");

//connection to the database
const connection = mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });
//setting up the body parser
app.use(express.json());
//router middleware initialization
app.use(`${url}/user`, UserRouter);
app.use(`${url}/auth`, AuthRouter);
app.use(`${url}/product`, ProductRouter);
app.use(`${url}/cart`, CartRouter);
app.use(`${url}/order`, OrderRouter);

app.listen(port, () => {
  console.log(`server started successfully at port ${port}`);
});
