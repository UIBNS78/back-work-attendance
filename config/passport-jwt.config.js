require('dotenv').config();
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Users = require('../config/local.env');
const passport = require('passport');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET
}
passport.use(new JwtStrategy(options, (payload, done) => {
    if (payload && payload.trigramme) {
        return done(null, payload);
    } else {
        return done(null, false, { message: "No user found." });
    }
}));