var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/nprScraper");

app.get("/scrape", function(req, res) {
  axios.get("https://www.npr.org/sections/news/").then(function(response) {
    var $ = cheerio.load(response.data);
    var result = {};
    $("div.item-info").each(function(i, element) {
      result.title = $(this)
        .find("h2.title")
        .text();
      result.summary = $(this)
        .find("p.teaser")
        .find("a")
        .text();
      result.link = $(this)
        .find("p.teaser")
        .find("a")
        .attr("href");

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });
    res.send("Scrape Complete");
  });
});

app.get("/api/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/api/articles/:id", function(req, res) {
  db.Article.findById({ _id: req.params.id })
    .populate("comment")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/api/articles/:id", function(req, res) {
  db.Comments.create(req.body)
    .then(function(dbComments) {
      // return db.Article.findOneAndUpdate({},{ comment: dbComments._id },{ new: true });
      return db.Article.findOneAndUpdate(
        {},
        { $push: { comment: dbComments._id } },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.delete("/api/articles/:id", function(req, res) {
  db.Comments.findByIdAndRemove({ _id: req.params.id })
    .then(function(err) {
      if(err) throw err;
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
