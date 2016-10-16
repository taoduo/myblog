var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require(__public + 'models/user.js');
var Post = require(__public + 'models/post.js');
var blog = require(__public + 'api/api.blog.js');
var Location = require(__public + 'api/api.location.js');
var multer = require('multer');
var fs = require('fs');
var atob = require('atob');

var savePicture = function(req, res) {
  var base64Data = req.body.pics.replace(/^data:image\/png;base64,/, "");
  fs.writeFile('./public/images/blog-img/a.png', base64Data, 'base64', function(err) {
  if(err) {
    return console.log(err);
  }
  res.end("The file was saved!");});
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
