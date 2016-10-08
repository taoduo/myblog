var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require(__public + 'models/user.js');
var Post = require(__public + 'models/post.js');
var blog = require(__public + 'api/api.blog.js');

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

module.exports = function(passport) {
  /* GET administrator page. */
  router.get('/', isAuthenticated, function(req, res) {
    res.render('management', {currentUser: req.user});
  });
  /* Handle blog post */
  router.post('/post', isAuthenticated, blog.postBlog);

  router.post('/getBlogs', isAuthenticated, blog.getUserBlog);

  router.post('/delete', isAuthenticated, blog.deleteBlog);

  router.post('/edit', isAuthenticated, blog.editBlog);
  return router;
}
