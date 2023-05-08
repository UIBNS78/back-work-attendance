const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('../config/local.env');
const queries = require('../common/queries');
const userAdapter = require('../adapter/user.adapter');
const token = require('../utils/auth.token');

module.exports = passport => {
    passport.use(new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
        Users.query(queries.select.LOGIN(username), (error, result) => {
            if (error) throw error;
            if (result && result.length <= 0) {
                return done(null, false, { message: "User doesn't exist." });
            } else {
                const u = { ...result[0] };
                try {
                    bcrypt.compare(password, u.password, async (error, success) => {
                        if (error)  throw error;
                        if (success) {
                            const user = await userAdapter.getUser(username);
                            user.token = token.generate({ ...user }, { expiresIn: '30s' });
                            return done(null, user);
                        } else {
                            return done(null, false, { message: "Wrong password." });
                        }
                    });
                } catch {
                    done(null, false, { message: "An error appears while decrypt password." });
                }
            }
        });
    }));

    passport.serializeUser((user, done) => done(null, user));

    passport.deserializeUser((user, done) => done(null, user));
}