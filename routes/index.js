const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');
const signController= require('../controllers/sign_controller');
const passport=require('../config/passport-local-strategy');
const session= require('express-session');



router.get('/', homeController.home);
// router.use('/user',passport.checkAuthentication, require('./user'));
router.use('/user', require('./user'));
router.get('/signup', passport.checkSignedIn, signController.signup);    //This signed in is being checked every time we are trying to access the login pages.
router.get('/signin',passport.checkSignedIn, signController.signin);
router.get('/signout',passport.logout, signController.signout);
router.use('/comment', require('./comment'));


router.post('/signuppage', signController.signupadd);
router.post('/create-session', passport.authenticate(   //This is the main function of the middle ware, as we hit the route, before passing the control to the controller function, this passport.authenticate method will run. This is exactly where the done function will come in handy, the done method will only run when there absolutely no error and done returns to passport itself. And from there when passport.authenticate checks it, it will call the controller function.
    'local',
    {failureRedirect: '/signin'}
), signController.createSession);       //This whole function is going to create a session cookie, and unlike the manual authentication, we will not be taking the user.id in the cookie. Instead of that we will be having a hash type of string that will be created on each user. And this will be encrypted as well as secure.

router.get('/resetpasswordpage', signController.resetPasswordPage);     //This router is to get us to the reset page, it does not reset the password at all. 
router.post('/reset', signController.reset);        //But this page is responsible for sending the data that is being collected by the form in the ejs file. And simultaneously if the iformation is coorect and required, we will update the db, in this function itself. As we do not need to call any other function for this.
// router.get('/changepassword', signController.changePassword);

router.use('/', require('./post'));
router.use('/',require('./comment'));
// router.post('/sendposttodb', postController.sendposttodb);


router.use('/api', require('./api'));       //This will simply add the index.js from the api folder, but if we do not export the router object from the index.js of api folder, this will throw an error since the api of router is being required here. The middle ware will make sure  that the api folder is accessible from this index.js file or else we will not be able to version different api version, simply because we cannot just jump to that folder we need to make it available through this middleware.


router.use('/likes', require('./likes'));



module.exports=router;