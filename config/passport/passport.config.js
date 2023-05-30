const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const Users = require("../../model/user.model");
const { messages } = require("../../common/all-strings");
const userAdapter = require("../../adapter/user.adapter");
const AuthToken = require("../../utils/auth.token");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "username" },
      (username, password, done) => {
        Users.findOne({ username })
          .then((res) => {
            if (!res) {
              return done(null, false, { message: messages.userUnexist });
            } else {
              try {
                bcrypt.compare(
                  password,
                  res.password,
                  async (error, success) => {
                    if (error) throw error;
                    if (success) {
                      const user = await userAdapter.getUser(username);
                      const token = AuthToken.generate({ ...user });
                      return done(null, { user, token });
                    } else {
                      return done(null, false, {
                        message: messages.wrongPassword,
                      });
                    }
                  }
                );
              } catch {
                done(null, false, { message: messages.catchBcrypt });
              }
            }
          })
          .catch((err) =>
            done(null, false, { message: "Can't connect to db." })
          );
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user));

  passport.deserializeUser((user, done) => done(null, user));
};
