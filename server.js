const express = require("express");
const bodyParser = require("body-parser");
const date = require("./date.js");
const mongoose = require("mongoose");
const _ = require("lodash");
const dotenv = require("dotenv");

const app = express();
dotenv.config();
mongoose.connect(process.env.MONGODB_URL);

const schema = new mongoose.Schema({
  page_title: String,
  item: String,
});
const home_schema = new mongoose.Schema({
  page_title: String,
});

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const collections_list = mongoose.model("todos", home_schema);

app.get("/", function (req, res) {
  collections_list.find().then(function (docs) {
    res.render("./home", { list: docs });
  });
});
app.get("/:customList", function (req, res) {
  const title = _.startCase(req.params.customList);
  const parameter = _.snakeCase(req.params.customList);
  const new_collection = mongoose.model(parameter, schema, parameter);
  new_collection.find().then(function (docs) {
    res.render("./list", { header: title, item: docs, btn: title });
  });
});
app.get("/favicon.ico", function (req, res) {
  // console.log("Got favicon.ico Request.");
});

app.post("/", function (req, res) {
  res.redirect("/");
});
app.post("/add", function (req, res) {
  let txt = req.body.item;
  let parameter = _.snakeCase(req.body.page_title);
  const collection = mongoose.model(parameter, schema, parameter);
  let doc = new collection(req.body);
  doc.save();
  res.redirect("/" + parameter);
});
app.post("/delete", function (req, res) {
  let txt = req.body.item;
  let parameter = _.snakeCase(req.body.page_title);
  const collection = mongoose.model(parameter, schema, parameter);
  collection.deleteOne({ item: txt }).finally();
  res.redirect("/" + parameter);
});
app.post("/newList", function (req, res) {
  let title = req.body.page_title;
  let doc = new collections_list(req.body);
  doc.save();
  res.redirect("/");
});
app.post("/presentList", function (req, res) {
  if (Boolean(req.body.btn)) {
    let title = req.body.btn;
    res.redirect("/" + title);
  } else {
    let title = req.body.delete;
    let parameter = _.snakeCase(title);
    collections_list.deleteOne({ page_title: title }).finally();
    mongoose.connection.dropCollection(parameter).catch(function (err) {
      console.log("Collection Not Found !");
    });
    res.redirect("/");
  }
});

app.listen(process.env.PORT, function () {
  console.log("Started the Server at Port: " + process.env.PORT);
});
