var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require(__public + 'models/user.js');
var bCrypt = require('bcrypt-nodejs');

// Generates hash using bCrypt
var createHash = function(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

module.exports = function(passport) {
  /* GET login page. */
  router.get('/', function(req, res) {
    if (req.isAuthenticated()) {
      var userToSend = {};
      userToSend.email = req.user.email;
      userToSend.username = req.user.username;
      userToSend.role = req.user.role;
      userToSend._id = req.user._id;
      var userInString = JSON.stringify(userToSend);
      res.render('index', {currentUser: userInString});
    } else {
      res.render('index', {currentUser: 'null'});
    }
  });

  /* Handle Login POST */
  router.post('/login', function(req, res) {
    passport.authenticate('login', function(err, user, info) {
      req.logIn(user, function() {
        if (user) {
          res.send(user);
        } else {
          res.send(info);
        }
      });
    })(req, res);
  });

	/* Handle Logout */
	router.post('/logout', function(req, res) {
		req.logout();
		res.end('user logged out');
	});

  /* Handle Registration POST */
  router.post('/signup', function(req, res) {
     passport.authenticate('signup', function(err, user, info) {
      if (user) {
        console.log(user);
        res.send(user);
      } else {
        console.log(info);
        res.send(info);
      }
     })(req, res);
  });
  return router;
}
