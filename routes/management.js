var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require(__public + 'models/user.js');
var Post = require(__public + 'models/post.js');
var Picture = require(__public + 'models/picture.js');

var blog = require(__public + 'api/api.blog.js');
var Location = require(__public + 'api/api.location.js');
var fs = require('fs');

var savePicture = function(req, res) {
  var base64Data = req.body.pics.data.replace(/^data:image\/png;base64,/, "");
  var type = req.body.pics.type;
  var fileName = new Date().getTime() + '.' + type;
  fs.writeFile('./public/images/blog-img/' + fileName, base64Data, 'base64', function(err) {
    if(err) {
      return console.log(err);
    }
    res.status(200).end('/public/images/blog-img/' + fileName);
  });
}

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
};

module.exports = function(passport) {
  /* GET administrator page. */
  router.get('/', isAuthenticated, function(req, res) {
    res.render('management', {currentUser: req.user});
  });
  /* Handle blog post */
  router.post('/post', isAuthenticated, blog.postBlog);

  router.post('/upload', isAuthenticated, savePicture);

  router.post('/getBlogs', isAuthenticated, blog.getUserBlog);

  router.delete('/blog', isAuthenticated, blog.deleteBlog);

  router.post('/edit', isAuthenticated, blog.editBlog);

  router.delete('/location', isAuthenticated, Location.deleteLocation);
  return router;
}
