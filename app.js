const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const config = require('config');
const db = config.get('mongoURI');
const _ = require('lodash');
const mongoose = require('mongoose');

const homeStartingContent =
  'Welcome to Daily Blog, Here you can write about Your daily stuff and can keep track of it. To  add new blog click on Add Blog and start writing your day to day experience ,you can add more information  about you by following the  About Us link and can add your contact information in Contact us page so that readers can connect with you ';
const aboutContent =
  'Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.';
const contactContent =
  'Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.';
mongoose.connect(db, { useNewUrlParser: true });
const app = express();
const postSchema = {
  title: String,
  Content: String,
};
const Post = mongoose.model('Post', postSchema);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get('/', function (req, res) {
  Post.find({}, function (err, result) {
    res.render('home', { homeContent: homeStartingContent, posts: result });
  });
});

app.get('/about', function (req, res) {
  res.render('about', { Content: aboutContent });
});
app.get('/contact', function (req, res) {
  res.render('contact', { Content: contactContent });
});
app.get('/compose', function (req, res) {
  res.render('compose');
});
app.post('/compose', function (req, res) {
  const post = new Post({
    title: req.body.titletext,
    Content: req.body.textpost,
  });
  post.save(function (err) {
    if (!err) {
      res.redirect('/');
    }
  });
});
app.get('/posts/:postname', function (req, res) {
  const custompostId = req.params.postname;

  Post.findOne({ _id: custompostId }, function (err, found) {
    res.render('posts', {
      posttitle: found.title,
      postcontent: found.Content,
    });
  });
});

let port = process.env.PORT;
if (port == null || port == '') {
  port = 3000;
}

app.listen(port, function () {
  console.log('Server started on port 3000');
});
