const express = require('express');
const router = express.Router();
const userContoller = require('../controller/users.conroller');
const token = require('../utils/auth.token');

// GET METHODS
router.get('/all', token.authenticate, userContoller.getAllUser);

// POST METHODS
router.post('/login', userContoller.login);
router.post('/signup', userContoller.signup);

module.exports = router;