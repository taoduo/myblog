var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require(__public + 'models/user.js');
var Post = require(__public + 'models/post.js');
var blog = require(__public + 'api/api.blog.js');
var Location = require(__public + 'api/api.location.js');
var multer = require('multer');
var storage = multer.diskStorage({
   destination: function (req, file, cb) {
     console.log(file);
     cb(null, '/public/images/blog-img/')
   },
   filename: function (req, file, cb) {
      cb(null, file.originalname);
   }
});
var uploading = multer({
   storage: storage,
});

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

  router.post('/upload', isAuthenticated, uploading.any());

  router.post('/getBlogs', isAuthenticated, blog.getUserBlog);

  router.delete('/blog', isAuthenticated, blog.deleteBlog);

  router.post('/edit', isAuthenticated, blog.editBlog);

  router.delete('/location', isAuthenticated, Location.deleteLocation);
  return router;
}
