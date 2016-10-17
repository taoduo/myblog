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
  var originalName = req.body.pics.filename;
  var split = originalName.split('.');
  var type = split[split.length - 1];
  var fileName = Math.random().toString(36).substring(7) + new Date().getTime() + '.' + type;
  var path = './public/images/blog-img/' + fileName;

  fs.writeFile(path, base64Data, 'base64', function(err) {
    if(err) {
      return console.log(err);
    }
    res.status(200).send({
      filename : originalName,
      path : path
    });
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
