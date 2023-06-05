const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();

app.set('view engine', "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const Article = new mongoose.model("Article", {
    title: String,
    content: String
});

//To get all articles
app.get("/articles", function(req, res){
    Article.find({}).then(function(foundArticles){
        res.send(foundArticles);
    }).catch(function(error){
        res.send(error);
    });
});

//To post a new article
app.post("/articles", function(req, res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save().then(function(){
    res.send("Article posted successfully!");
  });
});

//Delete all Articles
app.delete("/articles", function(req, res){
  Article.deleteMany({}).then(function(){
    res.send("Articles deleted successfully");
  }).catch(function(error){
    res.send("Error caught " + error);
  });
});

//To get a specific article
app.route("/articles/:articleTitle")
.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}).then(function(foundArticle){
    res.send(foundArticle);
  }).catch(function(error){
    res.send("Error caught " + error);
  })
})

//To replace an entire document. Make sure parameters match when testing
app.put("/articles/:articleTitle", function(req, res){
  Article.updateOne({title: req.params.articleTitle}, {title: req.body.title, content: req.body.content});
});

//To replace a specified field of an article
app.patch("/articles/:articletitle", function(req, res){
  Article.updateOne({title: req.params.articleTitle}, {//$set: field to be updated})
}).then(function(){
  res.send("Successful!");
}).catch(function(error){
  res.send("Error caught " + error);
});

//Delete specific article
app.delete("/articles/:articleTitle", function(req, res){
  Article.deleteOne({title: req.params.articleTitle}).then(function(deletedArticle){
    res.send("Deleted " + deletedArticle.title + "Article");
  }).catch(function(error){
    res.send("Error caught " + error);
  });
});







app.listen(3000, function(){
    console.log("Server is up and running on port 3000");
});
