const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

const checkPassword = require('../controllers/checkPassword');
const checkEmail = require('../controllers/checkEmail');

router.post('/signup',checkEmail,checkPassword,userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;