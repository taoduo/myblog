var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require(__public + 'models/user.js');
var bCrypt = require('bcrypt-nodejs');
var Post = require(__public + 'models/post.js');
var Loc = require(__public + 'models/location.js');
var LocationRecord = require(__public + 'models/locationRecord.js');

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
    var newPos = req.body;
    var newLoc = new Loc();
    newPos.lat = parseFloat(newPos.lat);
    newPos.lng = parseFloat(newPos.lng);
    newLoc.lat = newPos.lat;
    newLoc.lng = newPos.lng;
    newLoc.time = new Date();
    if (newPos.comment) {
      newLoc.comment = newPos.comment;
    } else {
      newLoc.comment = '';
    }
    newLoc.save(function(err) {
      if (err){
        console.log('Error in Saving Location: ' + err);
        res.send("save err");
        throw err;
      }
    });

    LocationRecord.aggregate([
      {
        $project: {
          dist: {
            $add: [
              { $multiply: [ { $subtract: [ newPos.lng, "$lng" ] }, { $subtract: [ newPos.lng, "$lng" ] } ] },
              { $multiply: [ { $subtract: [ newPos.lat, "$lat" ] }, { $subtract: [ newPos.lat, "$lat" ] }] }
            ]
          }
        }
      },
      {$sort: {dist: 1, recent: -1}},
      {$limit: 1}
    ], function(err, result) {
      console.log('aggregate callback');
      if (err) {
        console.log(err);
        res.send("error");
        throw err;
      }
      if (result.length == 0) {
        var nr = new LocationRecord();
        nr.lat = newPos.lat;
        nr.lng = newPos.lng;
        nr.comment = newPos.comment;
        nr.recent = newLoc.time;
        nr.save(function(err) {
          if (err) {
            res.send("error");
            throw err;
          }
          res.send("newrecord");
        });
      } else {
        if (result[0].comment != newPos.comment) {
          var newRec = new LocationRecord();
          newRec.lat = newPos.lat;
          newRec.lng = newPos.lng;
          newRec.comment = newPos.comment;
          newRec.recent = newLoc.time;
          newRec.save(function(err) {
            if (err) {
              res.send("error");
              return;
            }
            res.send("newrecord");
          });
        } else {
          res.send("record exists");
        }
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

  router.get('/locationGuess', function(req, res) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    LocationRecord.aggregate([
      {
        /* $project: {
          dist: {
            $sqrt: {
              $add: [
                { $pow: [ { $subtract: [ lng, "$lng" ] }, 2 ] },
                { $pow: [ { $subtract: [ lng, "$lng" ] }, 2 ] }
              ]
            }
          }
        } */
        $project: {
          dist: {
            $add: [
              { $multiply: [ { $subtract: [ lng, "$lng" ] }, { $subtract: [ lng, "$lng" ] } ] },
              { $multiply: [ { $subtract: [ lat, "$lat" ] }, { $subtract: [ lat, "$lat" ] }] }
            ]
          }
        }
      },
      {$sort: {dist: 1, recent: -1}},
      {$limit: 1}
    ], function(err, result) {
      if (err) {
        console.log(err);
        res.send("error");
        throw err;
      }
      if (result.length == 0) {
        console.log("empty");
        res.send("");
      } else {
        LocationRecord.findById(result[0]._id, function(err, result) {
          if (err) {
            console.log(err);
            throw err;
          }
          console.log(result);
          res.send(result.comment);
        });
      }
    });
  });
  return router;
}
