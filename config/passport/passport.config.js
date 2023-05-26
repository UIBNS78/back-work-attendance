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
                      const token = AuthToken.generate(
                        { ...user },
                        { expiresIn: "30s" }
                      );
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
        // Users.query(queries.select.LOGIN(username), (error, result) => {
        //   if (error) throw error;
        //   if (result && result.length <= 0) {
        //     return done(null, false, { message: messages.userUnexist });
        //   } else {
        //     const u = { ...result[0] };
        // try {
        //   bcrypt.compare(password, u.password, async (error, success) => {
        //     if (error) throw error;
        //     if (success) {
        //       const user = await userAdapter.getUser(username);
        //       user.token = token.generate(
        //         { ...user },
        //         { expiresIn: "30s" }
        //       );
        //       return done(null, user);
        //     } else {
        //       return done(null, false, { message: messages.wrongPassword });
        //     }
        //   });
        // } catch {
        //   done(null, false, { message: messages.catchBcrypt });
        // }
        //   }
        // });
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user));

  passport.deserializeUser((user, done) => done(null, user));
};
