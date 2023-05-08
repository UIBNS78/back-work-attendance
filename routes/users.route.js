const express = require('express');
const router = express.Router();
const userContoller = require('../controller/users.conroller');
const token = require('../utils/auth.token');
const passport = require('passport');

// GET METHODS
// router.get('/all', token.authenticate, userContoller.getAllUser);
router.get('/all', passport.authenticate('jwt', { session: false }), userContoller.getAllUser);

// POST METHODS
router.post('/login', (request, response, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (user) {
            response.json({ success: true, message: "", result: { user } });
        } else {
            response.json({ success: false, message: info.message, result: {} });
        }
    })(request, response, next);
});
router.post('/signup', userContoller.signup);

module.exports = router;