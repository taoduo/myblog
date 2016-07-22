module.exports.login = function(passport) {
  return function(req, res) {
    passport.authenticate('login', function(err, user, info) {
      req.logIn(user, function() {
        if (user) {
          res.send(user);
        } else {
          res.send(info);
        }
      });
    }) (req, res);
  }
};

module.exports.logout = function(req, res) {
  req.logout();
  res.end('user logged out');
};

module.exports.signup = function(passport) {
  return function(req, res) {
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
  }
}
