require("dotenv").config();
const { messages } = require("../../common/all-strings");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};
passport.use(
  new JwtStrategy(options, (payload, done) => {
    if (payload && payload._doc.username) {
      return done(null, payload);
    } else {
      return done(null, false, { message: messages.noUser });
    }
  })
);
