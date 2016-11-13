var express = require('express');
var router = express.Router();
var bCrypt = require('bcrypt-nodejs');
var fetch = require('node-fetch');
var user = require(__public + 'api/api.user.js');
var blog = require(__public + 'api/api.blog.js');
var location = require(__public + 'api/api.location.js');

// Generates hash using bCrypt
var createHash = function(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

module.exports = function(passport) {
  router.get('/', function(req, res) {
    var options = {
      host: 'api.github.com',
      path: '/users/taoduo/repos',
      method: 'GET'
    };

    fetch('https://api.github.com/users/taoduo/repos')
    .then(function(res) {
      return res.json();
    }).then(function(json) {
      repos = json.map(function(rep) {
        return {
          'name' : rep['name'],
          'url' : rep['html_url'],
          'desc' : rep['description']
        }
      });
      if (req.isAuthenticated()) {
        var userToSend = {};
        userToSend.email = req.user.email;
        userToSend.username = req.user.username;
        userToSend.role = req.user.role;
        userToSend._id = req.user._id;
        var userInString = JSON.stringify(userToSend);
        res.render('index', {currentUser: userInString, repos : repos});
      } else {
        res.render('index', {currentUser: 'null', repos : repos});
      }
    });
  });

  router.post('/getHomeBlog', blog.getHomeBlog);

  router.post('/getBlog', blog.getBlog);

  /* Handle Login POST */
  router.post('/login', user.login(passport));

	/* Handle Logout */
	router.post('/logout', user.logout);

  /* Handle Registration POST */
  router.post('/signup', user.signup(passport));

  router.post('/location', location.postLocation,location.checkRecordExistence, location.saveRecord);

  router.get('/location', location.getLocation);

  router.get('/locationGuess', location.locationGuess);

  router.get('/blogs/:url', function(req, res) {
    if (req.isAuthenticated()) {
      var userToSend = {};
      userToSend.email = req.user.email;
      userToSend.username = req.user.username;
      userToSend.role = req.user.role;
      userToSend._id = req.user._id;
      var userInString = JSON.stringify(userToSend);
      res.render('blog', {currentUser: userInString});
    } else {
      res.render('blog', {currentUser: 'null'});
    }
  });
  router.post('/blogs/:url', blog.getWithUrl, function(req, res) {
    res.send(req.blog);
  })
  return router;
}
