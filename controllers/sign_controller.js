const User = require('../models/user');





module.exports.signup=function(req,res){
    return res.render('signUp',{
        title : 'User Sign up Page'
    });
};

module.exports.signupadd=function(req,res){    
    if(req.body.password!=req.body.confirmpassword){
        return res.redirect('/signup');
    }

    User.findOne({email : req.body.email}, function(err,user){
        if(err){console.log(err);return;}

        if(!user){
            User.create(req.body,function(err,task){
                if(err){console.log(err);return;}
                // require('../automail/mailgun');     //There is a problem with requiring this line here it only runs once per server start. If the server is already running then this mail will not be sent. We need to read the documentation once again to find a function that will be responding over and over again as any new user signs up. But for now this function is fine.
                return res.redirect('/signin');
            });
        }
        else {
            console.log("User already exists");
            return res.redirect('/signup');
        }
    });
};


module.exports.signin=function(req,res){
    console.log('sign in me hai be');
    
    return res.render('signIn',{
        title : 'User Sign up Page'
    });    
};

module.exports.signout=function(req,res){
    console.log('sign out me hai be');
    // console.log(req.flash('success'));
    // req.flash('success','You have logged out Successfully');
    //If we keep the above line here, this will throw and error, since at this point, this function is just redirecting to the home page. Instead we will have to put this animation in that that function which is activating it before req.logout() or before the destroying of the session.
    // req.logout();
    // console.log(req.display);
    req.flash('success','Logged out Successfully '+req.display.split(' ')[0]);        //In the passport.logout method, the session is not deleted, only the authentication cookie is deleted. This is why the flash message could be transmitted to the next middleware, and could be executed. And if we delete the session, the flash message will not be executed, since the session need to be present for this flash message.    
    
    return res.redirect('/');
};


module.exports.createSession=function(req,res){
    console.log('create-session me hai be');
    
    //console.log(req.session);
           //The session will be created by this function, and if we want access the cookie that is builtin the session we can directly access it just after creation of the session.
    //console.log(req.cookie);
            //This variable does not exist, as we are not creating cookie directly, only with the help of express-session and passport libraries. But in the manual authentication, we had created our cookie manually.
            //In this automatic authentication, the cookie is encrypted and this is why we could not directly access it using req.cookie.
            
    req.flash('success','Logged in Successfully ' +req.user.name.split(' ')[0]);      //This lines first gets executed before the calling of middle ware. Only the return response statement will be called after the successful invocation of the middleware. This req.flash message is the one that is being passed into the middleware. And it is being stored in the value of 'success'.
    return res.redirect('/');    
};


module.exports.resetPasswordPage=function(req,res){
    console.log('reset password me hai be');
    return res.render('resetpasswordpage',{
        title : "Password Reset Page",
        user : req.user     //This data was not used in the ejs front end.
    });
};

module.exports.reset=function(req,res){     //This function has been called after the form submission, this simply means the data that is collected in form will only be present in this function. If we want to create an extra function for updating of db. Then the data collected from form will not be present. 
    if(req.body.password!=req.body.confirmpassword){
        console.log('password and confirm password did not match');
        return res.redirect('back');
    }

    User.findOne({email : req.user.email}, async function(err,user){
        if(err){console.log(err);return;}

        if(req.body.oldpassword != req.user.password)
        {
            console.log('password did not match from the data base');
            return res.redirect('back');;
        }
        console.log(req.body);


        try {
            console.log("last function me hai");
            console.log(req.body);
            await User.findByIdAndUpdate(req.user.id, {
                password : req.body.password
            });
    
            console.log('password has been updated, kindly sign in again');
          } catch(err) {
              console.error(err.message);
              res.send(400).send('Server Error');
          }
        return res.redirect('/signout');
    });
};
