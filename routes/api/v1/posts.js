const express = require('express');
const router = express.Router();
const postApi = require('../../../controllers/api/v1/posts_api');
// const passport = require('passport');
const passport = require('../../../config/passport-jwt-strategy')

// router.use('/posts', require('../../../controllers/api/v1/post_api'));
router.get('/', postApi.index);
router.delete('/:id',passport.authenticate('jwt', {session: false}), postApi.destroy);      //We will create an authentication token with the help of jwt passport strategy, and not on the basis of local strategy, and the session should not be generated, this simply means as soon as the server restarts, the session will be deleted.

module.exports = router;