const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");
const path = require("path");
 
app.use(cors());
app.options("*", cors());

const api = process.env.API_URL;

//middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt()); 

// app.use('/public', express.static(__dirname + '/public/uploads'));

app.use("/public", express.static(path.join("public")));
app.use("/public/upload", express.static(path.join("public/uploads")));



app.use(errorHandler);

//Routes
const categoriesRoutes = require("./routes/categories");
const productsRoutes = require("./routes/products");
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

//Database
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("Database Connection is ready ...");
  })
  .catch((err) => {
    console.log(err);
  });

//Server
app.listen(3000, () => {
  console.log("server is running now http://localhost:3000");
});

// mongodb+srv://shop-user:M123456@cluster0.flncc.mongodb.net/eshop-database?retryWrites=true&w=majority
