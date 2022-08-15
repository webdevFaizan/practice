const express = require('express');
const router = express.Router();
const postController= require('../controllers/posts_controller');
const passport = require('passport');
const passportLocal  = require('../config/passport-local-strategy');

//Both of the following router is correct, as passport will also have access to checkAuthentication object, as well as the passportLocal will also have an access to the method.
// router.post('/sendposttodb',passport.checkAuthentication, postController.sendposttodb);
router.post('/sendposttodb',passportLocal.checkAuthentication, postController.sendposttodb);


//It is clear from the below syntax that the method is not post, we are recieving the id of the user as params. This mean we could receive the data from the form or from the a tag.
router.get('/posts/destroy/:postId',passportLocal.checkAuthentication, postController.deletePost);


module.exports= router;