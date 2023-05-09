const Users = require('../config/local.env');
const { queries, messages } = require('../common/all-strings');
const bcrypt = require('bcryptjs');
const token = require('../utils/auth.token');

// get all user
function getAllUser() {
    return new Promise((resolve, reject) => {
        Users.query(queries.select.ALL_USER, (error, result) => {
            if (error)
                resolve({ success: false, message: error.message, result: {} });
            if (result && result.length > 0) {
                resolve({ success: true, result: { users: result } });
            }
        });
    });
}

// POST
function login(user) {
    const { username, password } = user;
    return new Promise((resolve, reject) => {
        Users.query(queries.select.LOGIN(username), async (error, result) => {
            if (error)
                resolve({ success: false, message: error.message, result: {} });
            if (result && result.length > 0) {
                const u = { ...result[0] };
                try {
                    bcrypt.compare(password, u.password, async (error, success) => {
                        if (error)  throw error;
                        if (success) {
                            const user = await getUser(username);
                            user.token = token.generate({ ...user });
                            resolve({ success: true, result: user });
                        } else {
                            resolve({ success: false, message: messages.wrongPassword, result: {} })
                        }
                    });
                } catch {
                    resolve({ success: false, message: messages.catchBcrypt });
                }
            } else {
                resolve({ success: false, message: messages.userUnexist });
            }
        });
    });
}

function signup(user) {
    const { username, password } = user;
    return new Promise(async (resolve, reject) => {
        if (username && password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await getUser(username);
            if (user) {
                resolve({ success: false, message: messages.userExist, result: {} });
            } else {
                Users.query(queries.insert.SIGNUP(username, hashedPassword), async (error, result) => {
                    if (error)
                        resolve({ success: false, message: error.message, result: {} });
                    if (result && result.affectedRows > 0) {
                        const user = await getUser(username);
                        resolve({ success: true, message: messages.loginDone, result: { user: user } });
                    } else {
                        resolve({ success: false, message: messages.insertFailed });
                    }
                });
            }
        } else {
            resolve({ success: false, message: messages.fieldEmpty, result: {} });
        }
    });
}

function getUser(username) {
    return new Promise((resolve, reject) => {
        Users.query(queries.select.USER_BY_TRIGRAM(username), async (error, user) => {
            if (error)
                resolve({});
            if (user && user.length > 0) {
                    resolve(JSON.parse(JSON.stringify(user[0])));
            } else {
                resolve({});
            }
        });
    });
}

module.exports = {
    getAllUser, login, signup, getUser
}