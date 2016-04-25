var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

// Generates hash using bCrypt
var createHash = function(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

module.exports = function(passport) {
  /* GET login page. */
  router.get('/', function(req, res) {
    // Display the Login page with any flash message, if any
      res.render('index');
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
