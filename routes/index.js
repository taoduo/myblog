var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require(__public + 'models/user.js');
var bCrypt = require('bcrypt-nodejs');
var Post = require(__public + 'models/post.js')
var Loc = require(__public + 'models/location.js')
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

  router.post('/getHomeBlog', function (req, res) {
    Post.find({'home':true}, function (err, post) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.send(post);
    }).sort({date:-1}).limit(10);
  });

  router.post('/getBlog', function (req, res) {
    Post.find({}, function (err, post) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.send(post);
    }).sort({date:-1}).limit(20);
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
        req.logIn(user, function() {
          if (user) {
            res.send(user);
          } else {
            res.send(info);
          }
        });
      } else {
        console.log(info);
        res.send(info);
      }
     })(req, res);
  });

  router.post('/location', function(req, res) {
    console.log('Post Request received!')
    var newPos = req.body;
    var newLoc = new Loc();
    newLoc.lat = newPos.lat;
    newLoc.lng = newPos.lng;
    newLoc.time = new Date();
    if (newPos.comment) {
      newLoc.comment = newPos.comment;
    } else {
      newLoc.comment = '';
    }
    console.log('ready to save the location!')
    newLoc.save(function(err) {
      if (err){
        console.log('Error in Saving Location: ' + err);  
        res.send("save err");
        throw err;
      } else {
        console.log('save success, ready to send the message!');
        res.send('success');
      }
    });
  });

  router.get('/location', function(req, res) {
    Loc.find({}, function(err, location) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.send(location);
    }).sort({time:-1}).limit(10)
  });
  return router;
}
