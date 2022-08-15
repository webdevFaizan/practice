const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');


// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: '99853233324-4igkm3m0j85rf7miv21170tj7um0pdoc.apps.googleusercontent.com', // e.g. asdfghjkkadhajsghjk.apps.googleusercontent.com
    clientSecret: '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', // e.g. _ASDFA%KFJWIASDFASD#FAD-
    callbackURL: "http://localhost:3000/user/auth/google/callback",
},

function(accessToken, refreshToken, profile, done){     //the access token is something that gives us an authentication of the user, it is similar to jsonwebtoken. The refreshToken is used when the accesstoken expires, we get a new accessToken when the old access tokens expires. 
    

//The below method will automatically find the first user and check if it is in the database or not, if it is then the function will be called and stopped.     
    User.findOne({email: profile.emails[0].value}).exec(function(err, user){        //This exec function is an another way of having a callback function.
        if (err){console.log('error in google strategy-passport', err); return;}
        console.log(accessToken, refreshToken);
        console.log(profile);

        if (user){
            // if found, set this user as req.user
            return done(null, user);
        }else{
            // if not found, create the user and set it as req.user, and by req.user it means simply sign in that user. This is because we do not want user to sign in again after signing up on the webpage, this creates a bad user experience.
            User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')            // I think in google authentication the password field must be created like this, coz everytime when we login using google, we do not need password at all.
            }, function(err, user){
                if (err){console.log('error in creating user google strategy-passport', err); return;}

                return done(null, user);
            });
        }

    }); 
}
));

//I realised, the google auth also gives us a link for the profile picture of every user that is on google. This means if some person on our website is logging using google, we do not need to keep their photo in our data base, we could just show the image using the google link.
//Just read the node.js docx file to read more about the information that we get from google, especially profile.

module.exports = passport;