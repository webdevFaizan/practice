const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;   //We require Strategy here, so just remember this up.
const User = require('../models/user');

passport.use( new LocalStrategy({
    usernameField: 'email',         //This part is only added to tell passport variable that email is the usernameField and it has to be kept unique.
    passReqToCallback : true        //This key value pair is passed so that req object is available in the function below, this will be used to send the flash message in case the user has put in the wrong password.
},
//Done is the callback function that is reporting back to the passport.js
    function (req, email, password, done) {  //After creation of the LocalStrategy, this done function will consist of the command that will be executed after the LocalStrategy will be created, and it will consist whether there is an error or success.
        // find a user and establish the identity
        User.findOne({ email: email }, function (err, user) { //Findone method takes first parameter as the unique identifier and in this case it is email.
            if (err) {
                // console.log('Error in finding user --> Passport');
                req.flash('error',"There is some error");
                return done(err);
            }

            if (!user || user.password != password) {
                // console.log('Invalid Username/Password');
                req.flash('error',"Invalid Username/Password"); //The custom flash message will be called using a centralised middleware. And we are sending the message from this callback to the flash middleware using this req.flash. This could only be done when we are using req object in this function. For this we need to add a new key value pair in the LocalStrategy object, passReqToCallback() method.
                return done(null, false);       //The first parameter is null, it means there is not error, but the second parameter is false, this means some other problem is there like the password mismatch or username missing.
            }

            return done(null, user);    //The first parameter is null, it means there is no error, but the second parameter is user, this means no other problem is there and we are ready to pass the user.
        });
    }
));

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){        //No need to mug up this function, we could just google search how the process is done after the user is identified in the method passport.use, just google "how to store the id of user as session id after authentication using passport.js" You will get a stack overflow link. - [https://stackoverflow.com/questions/66907504/passport-session-i-want-store-user-information-in-session-but-only-id-in-brow]
    done(null, user.id);        //We only want the user.id to be kept inside the cookie, in order to keep check of the identity, this is kept in the form of session cookie, which means it will be kept encrypted.
});

//Done is not a fixed name, we could call it completed or anything. Just a variable name

// deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done){        //id is simply a variable that is kept to store the value of the variable from the cookie, and it will be first decrypted then it will be used to find the user associated with it.
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user --> Passport');
            return done(err);
        }
        return done(null, user);            //This is a method that attatches the 'user' with all the endpoints, as all the end points will pass through this deserializeuser method. This is like a middle ware for the parsing of user identity from the cookie. I had a very confusing doubt that passport.setAuthenticatedUser is attaching the user req.user to every end point but that is not true.
    });
});


// check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    // if the user is signed in, then pass on the request to the next function(controller's action)
    if (req.isAuthenticated()){     //This isAuthenticated function is provided by the passport library. And what ever method is calling this checkAuthentication method, will send res, which will be received as req in this method.
        return next();      //This next is not going to setAuthenticationUser method below, this next is a middle ware between the router and the controller function. And it will only run as a checker between them only.
    }
    // if the user is not signed in
    return res.redirect('/signin');
}

passport.setAuthenticatedUser = function(req, res, next){       //I am not sure what this function does, the user identity is attatached through the deserializeUser method, as it parse the data out of the cookie to identify the actual user. I am not sure setAutehnticatedUser method even has a significance.
    if (req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views. Just understand it like - before passing the important information to some view engine, it will be checked for authentication. 
        res.locals.user = req.user;     //One question? Where is this res.locals.user actually being used? Because even if we are deleting this method, we can do all the authentication work without it. There is one use, it will save the detail of user in locals object, and this simply means, on any page if we want to use the personal data of the user, locals could be called, just like in the home page (home.ejs), where we did not display text area if locals.user is not present.
        // console.log('setAuth me hai');
        // console.log(res.locals.user);

    }
    /*else{     //This else condition is working, when the user is logged out
        console.log('setAuth ke else me hai');
        console.log(res.locals.user);
    }*/
    next();
}


passport.checkSignedIn = function(req, res, next){
    // if the user is not signed in, then pass on the request to the next function(controller's action)
    if (!req.isAuthenticated()){     //This isAuthenticated function is provided by the passport library. And what ever method is calling this checkAuthentication method, will send res, which will be received as req in this method.
        return next();      //If the user is not authenticated then only go to the sign in and sign up pages.
    }
    // if the user is signed in then do not go to the sign in or sign up pages.
    return res.redirect('back');
}


// passport.logout= function(req, res, next){
//     req.flash('success','You have logged out Successfully');     //This message is not being transmitted, since the session is being destoryed in the below lines. Instead of these session destruction we could have just logged out the user. That would be ok.
//     req.logout(function(err) {       //Note we can only call one req.logout function, either with parameter or without parameter. This is simply because req.logout requires a callback. And there is only on callback coming from router (the route that is calling this passport.logout method.)
//         if (err) { return next(err); }
//         res.status(200).clearCookie('codeial', {     //Instead of deleting the session we could have cleared the cookie this will itself make the logout succesful, while allowing us to have the req.flash capable of displaying the logout message, since this logout message can only be executed when session is present, deleting the session is going to create problems.
//             path: '/'
//         });
//         req.session.destroy(function (err) {
//             // res.redirect('/');
//             return next();
//           });
//       });
// }









passport.logout= async function(req, res, next){      //Read the different variant of this logout method, just above this.
    // res.locals.display=req.user.name;
    var na= await req.user.name;
    req.logout(function(err) {
        if (err) { return next(err); }
        res.status(200).clearCookie('codeial', {
            path: '/'
        });        
        console.log('logout me hai be but apna naa hai - ' +na);
        req.display= na;
        return next();      //Here we did not destroy session but instead just deleted the cookie. And the req.logout() is called only for one time.
      });
}
module.exports = passport;      //We are not exporting the LocalStrategy but only the passport variable.





