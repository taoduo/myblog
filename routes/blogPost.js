var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require(__public + 'models/user.js');
var Post = require(__public + 'models/post.js');

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
  router.post('/', isAuthenticated, function(req, res) {
    var newPost = new Post();
    newPost.title = req.body.title;
    newPost.content = req.body.content;
    newPost.date = new Date();
    newPost.author = req.user;
    newPost.home = req.body.home;

    newPost.save(function(err) {
      if (err){
          console.log('some err');
          console.log('Error in Saving post: ' + err);  
          throw err;  
      }
      res.send('Posted!');
    });
  });
  return router;
}