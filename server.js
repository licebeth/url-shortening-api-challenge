require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const uuid = require("uuid");
const https = require("https");

const app = express();

const dbConnect = "mongodb+srv://"+ process.env.DB_ADMIN + ":" + process.env.DB_PASS + "@cluster0.m6ab4.mongodb.net/shortenUrlDB?retryWrites=true&w=majority";

mongoose.connect(dbConnect, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.use(cookieParser());

const urlSchema = mongoose.Schema({
  longUrl: String,
  shortUrl: String,
  cookieVal: String
});

const Url = mongoose.model("url", urlSchema);


app.get("/", function(req,res) {
  let userCookie = req.cookies["timestamp"];
  if(userCookie){
    console.log("Cookie exist: " + userCookie);
  } else {
    let cookieId = uuid.v1();
    res.cookie("timestamp", cookieId, {httpOnly: true});
    console.log("New Cookie set");
    userCookie = cookieId;
  }
  Url.find({cookieVal: userCookie}, function(err,result){
    if (err) {
      console.log(err);
    } else {
      res.render("index", {Items: result});
    }
  })
})

app.post("/", function(req,res){
  let cookieVal = req.cookies["timestamp"];
  let input = req.body.inputlink;
  let apiAddress = "https://api.shrtco.de/v2/shorten?url="+input;
  https.get(apiAddress, function(response){
    response.on("data", function(data){
      let result = JSON.parse(data);
      let newItem = Url({
        longUrl: result.result.original_link,
        shortUrl: result.result.full_short_link,
        cookieVal: cookieVal
      });
      newItem.save(function(err){
        if(err) {
          console.log(err);
        } else {
          console.log("New item is saved!");
          res.redirect("/");
        }
      });
    })
  })
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server setup success");
})
