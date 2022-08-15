const express = require('express');
const router = express.Router();

//Note - This versioning of API, is more professional as well as we are recreating all the authentication thing, but with a slight difference this time, we are using jsonwebtoken and using jwt strategy, for this api, this simply means the local strategy will be obsolete after this point, and the webtoken will not be required to be stored in order to be sure that there is a safe authenticated login.

//Just like we created routes, we created controller, by versioning the api, so that any update could transferred seamlessly.


router.use('/posts', require('./posts'));
router.use('/users',require('./users'));

module.exports = router;