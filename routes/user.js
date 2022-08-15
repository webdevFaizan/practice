const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const dataController = require('../controllers/data_controller');
const passport=require('../config/passport-local-strategy');
const signController= require('../controllers/sign_controller');
const mainPassport = require('passport');
// const google = require('passport-google-oauth');

router.get('/', userController.user);
router.get('/data/self',passport.checkAuthentication, userController.personalData);  //This checkAuthentication function is defined only in the passport-local-strategy and this is why that file had to be loaded.  And this will act as a middle ware. And if the cookie is present then it will continue or else it wil not.
router.get('/data/:userId',passport.checkAuthentication, userController.data);
router.get('/update', passport.checkAuthentication, userController.update);
router.post('/submitupdateform', passport.checkAuthentication, userController.submitUpdateForm);


//passport-google-oauth routers
router.get('/auth/google', mainPassport.authenticate('google', {scope : ['profile','email']} ));
router.get('/auth/google/callback', mainPassport.authenticate(
    'google', 
    {failureRedirect: 'back'}
), signController.createSession);



module.exports=router;