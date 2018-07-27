var express = require("express");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");

var app = express();

app.use(express.static("public"));

var databaseUrl = "scraper";
var collections = ["scrapedData"];

var db = mongojs(databaseUrl, collections);

db.on("error", function(error) {
  console.log("Database Error:", error);
});

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/api/all", function(req, res) {
  db.scrapedData.find({}, function(error, found) {
    // Log any errors if the server encounters one
    if (error) {
      console.log(error);
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(found);
    }
  });
});

app.get("/api/scrape", function(req, res) {
  request("https://www.nytimes.com/", function(error, response, html) {
    var $ = cheerio.load(html);

    $("article.story.theme-summary").each(function(i, element) {
    //   var summary = $(element)
    //     .children("p.summary")
    //     .text();
      var title = $(element)
        .children("h2.story-heading")
        .children("a")
        .text();
      var link = $(element)
        .children("h2.story-heading")
        .children("a")
        .attr("href");

      db.scrapedData.save(
        {
          title: title,
          link: link
        },
        function(err, saved) {
          if (error) {
            console.log(err);
          } else {
            console.log(saved);
          }
        }
      );
    });
  });
  res.send("scarpe commplete");
});
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
