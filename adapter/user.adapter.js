const Users = require('../config/local.env');
const queries = require('../common/queries');
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
                    if (await bcrypt.compare(password, u.password)) {
                        const user = await getUser(username);
                        user.token = token.generate({ ...user });
                        resolve({ success: true, result: user });
                    } else {
                        resolve({ success: false, message: "Wrong password", result: {} })
                    }
                } catch {
                    resolve({ success: false, message: "Can't decrypt password." });
                }
            } else {
                resolve({ success: false, message: "User doesn't exist." });
            }
        });
    });
}

async function signup (user) {
    const { username, password } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise(async (resolve, reject) => {
        const user = await getUser(username);
        if (user) {
            resolve({ success: false, message: "User already exists.", result: {} });
        } else {
            Users.query(queries.insert.SIGNUP(username, hashedPassword), async (error, result) => {
                if (error)
                    resolve({ success: false, message: error.message, result: {} });
                if (result && result.affectedRows > 0) {
                    const user = await getUser(username);
                    resolve({ success: true, message: "You are done.", result: { user: user } });
                } else {
                    resolve({ success: false, message: "Insert wasn't work." });
                }
            });
        }
    });
}

// PRIVATE METHOD
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
    getAllUser, login, signup
}