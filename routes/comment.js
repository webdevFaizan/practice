const express = require('express');
const router = express.Router();
const commentController= require('../controllers/comment_controller');
const passport = require('passport');
const passportLocal  = require('../config/passport-local-strategy');

router.post('/', passport.checkAuthentication, commentController.comment);

router.get('/comments/destroy/:commentId', passportLocal.checkAuthentication, commentController.deleteComment);

module.exports = router;