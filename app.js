const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("//mongodb://localhost:27017/blogPostDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  address: String
});

const Post = mongoose.model("post", postSchema);

app.get("/", function(req, res) {
  Post.find({}, function(err, post) {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        posts: post
      });
    }
  });
});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/posts/:postTitle", function(req, res) {
  let currPostTitle = req.params.postTitle
  console.log("herherehre"); // 들어옴

  Post.findOne({
    address: currPostTitle
  }, function (err, existingPost) {
    if (err) {
      console.log(err);
    } else {
      console.log("rorororro"); // 들어옴
      if (!existingPost) {
        res.render("wrong-post-title");
      } else {
        console.log("alalalalal");
        res.render("post", {
          post: existingPost
        });
      }
    }
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) { //need to implement if same title, need new
  const newPost = {
    title: req.body.composeTitle,
    content: req.body.composeContent
  };

  Post.findOne({
    address: _.lowerCase(newPost.title)
  }, function(err, existingPost) {
    if (err) {
      console.log(err);
    } else {
      if (!existingPost) {
        const post = new Post({
          title: newPost.title,
          content: newPost.content,
          address: _.lowerCase(newPost.title)
        });
        post.save();
        res.redirect("/posts/" + post.address);
      } else {
        res.render("already-post-title");
      }
    }
  });
});


app.listen(3500, function() {
  console.log("Server started on port 3500");
});
