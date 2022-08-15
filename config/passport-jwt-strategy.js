//passport library methods are only used to properly check for the authentication, earlier we were using the local-strategy for our authentication, but now we are using this passport-jwt-strategy to authenticate. And jwtFromRequest, will extract the jwt from the header, using the decrtyption key 'jinx' and that will be used to authenticate the user for various purposes.


const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;      //This will help us in extracting jwt from the passport-jwt

const User = require('../models/user');

//In order to successfully utilize the authentication, we have to use the key for authentication.
//The header will contain the JWT, and for now we seem too curious, about what is header, we will know about it later.

var opts = {};      //This is the options object.
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();     //This will extract the jwt from the bearer token. 
opts.secretOrKey = 'jinx';      //This is the encrypting key, that will be used to encrypt or decrypt.



passport.use(new JWTStrategy(opts, function(jwtPayLoad, done) {     //This function will look similar to that of the passport-local-strategy, but here we are not matching the email and password, in here, the user is already present in the jwt, and we are just checking if the user is present in the jwt, if yes this means the user is authenticated.
    User.findById(jwtPayLoad._id, function(err, user) {     //In the passport api documentation, this function was not present, and findOne was present and that led to confusion since this function takes different parameter and it took me some time to debug the code.
        if (err) {
            console.log("error in jwtstrategy");
            return done(err, false);
        }
        if (user) { //if the user is authenticated, then passport will automatically set the user as req.user, this simply means the user will be ready to access what every it could access.
            console.log("jwt-user is" +user.id);
            return done(null, user);        //First parameter is false, means the error is null
        } else {
            return done(null, false);       //Second parameter is false, means the user function is not found.
            // or you could create a new account
        }
    });
}));


module.exports = passport;
