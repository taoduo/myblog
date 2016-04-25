var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('login', new LocalStrategy({
            passReqToCallback : true,
            usernameField: 'email',
        },
        function(req, username, password, done) {
            // check in mongo if a user with username exists or not
            User.findOne({ 'email' :  username }, 
                function(err, user) {
                    // In case of any error, return using the done method
                    if (err)
                        return done(err);
                    // Username does not exist, log the error and redirect back
                    if (!user){
                        return done(null, false, {'message': 'User Not found.'});                 
                    }
                    // User exists but wrong password, log the error 
                    if (!isValidPassword(user, password)){
                        return done(null, false, {'message': 'Invalid Password'}); // redirect back to login page
                    }
                    // User and password both match, return user from done method
                    // which will be treated like success
                    return done(null, user);
                }
            );
        })
    );


    var isValidPassword = function(user, password) {
        return bCrypt.compareSync(password, user.password);
    }
}