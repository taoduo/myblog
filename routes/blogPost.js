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
  /* GET login page. */
  router.get('/', isAuthenticated, function(req, res) {
    res.render('blogPost', {currentUser: req.user});
  });

  /* Handle Login POST */
  router.post('/', isAuthenticated, blog.postBlog);
  return router;
}
