const path = require("path");
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
// const { mongoConnect } = require("./util/database");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("64dcb036890263abd0073bc7")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(process.env.DB_URL)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        User.create({
          name: "Manu",
          email: "manu@gmail.com",
          cart: {
            items: [],
          },
        });
      }
    });
    console.log("connected");
    app.listen(3000, () => {
      console.log("starting the server at 3000");
    });
  })
  .catch((err) => console.log(err));
