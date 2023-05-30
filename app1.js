const mongoose = require("mongoose");
const express = require("express");
const mongodb = require("mongodb");
mongoose.connect("mongodb://127.0.0.1:27017/todoDB", {useNewUrlParser: true});

const app = express();

app.use(express.static("public"));

let names = mongodb.db.listCollections();
console.log(names);

app.listen(3000, function(){
  console.log("Started the Server at Port: 3000");
});

app.listen(27017, function(){
  console.log("Started the Server at Port: 27017");
});
