const express = require('express');
const router = express.Router();
const signController= require('../controllers/sign_controller');

router.get('/', signController.signup);
router.post('/signuppage', signController.signupadd);

module.exports=router;