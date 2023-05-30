const Users = require("../model/user.model");
const { messages } = require("../common/all-strings");
const bcrypt = require("bcryptjs");
const AuthToken = require("../utils/auth.token");

// get all user
function getAllUser() {
  return new Promise((resolve, reject) => {
    Users.find()
      .sort({ created_at: "descending" })
      .then((users) => {
        resolve({ success: true, message: "", result: users });
      })
      .catch((err) => {
        console.log("errorrrr", err);
        resolve({ success: false, message: err.message, result: {} });
      });
  });
}

// search user
function searchUser(keyword, userConnected) {
  return new Promise(async (resolve, reject) => {
    if (keyword && keyword.length >= 3) {
      const query = {
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { firstName: { $regex: keyword, $options: "i" } },
          { username: { $regex: keyword, $options: "i" } },
        ],
      };
      Users.find(query)
        .find({ _id: { $ne: userConnected._id } })
        .then((result) => {
          resolve({ result });
        })
        .catch((err) => {
          console.log(err);
          resolve({ success: false, message: err.message, result: {} });
        });
    } else {
      resolve({
        success: false,
        message: "keyword empty or too short",
        result: {},
      });
    }
  });
}

// POST
// function login(user) {
//   const { username, password } = user;
//   return new Promise((resolve, reject) => {
//     Users.query(queries.select.LOGIN(username), async (error, result) => {
//       if (error)
//         resolve({ success: false, message: error.message, result: {} });
//       if (result && result.length > 0) {
//         const u = { ...result[0] };
//         try {
//           bcrypt.compare(password, u.password, async (error, success) => {
//             if (error) throw error;
//             if (success) {
//               const user = await getUser(username);
//               user.token = token.generate({ ...user });
//               resolve({ success: true, result: user });
//             } else {
//               resolve({
//                 success: false,
//                 message: messages.wrongPassword,
//                 result: {},
//               });
//             }
//           });
//         } catch {
//           resolve({ success: false, message: messages.catchBcrypt });
//         }
//       } else {
//         resolve({ success: false, message: messages.userUnexist });
//       }
//     });
//   });
// }

function signup(user) {
  const { name, firstName, username, password } = user;
  return new Promise(async (resolve, reject) => {
    if (name && firstName && username && password) {
      // check if user already exists
      const user = await getUser(username);
      if (Object.keys(user).length > 0) {
        resolve({ success: false, message: messages.userExist, result: {} });
      } else {
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // insert new user in table
        const newUser = { name, firstName, username, password: hashedPassword };
        const res = await Users.create(newUser);
        if (res.name) {
          const token = AuthToken.generate({ ...res });
          resolve({
            success: true,
            message: messages.insertOK,
            result: { user: res, token },
          });
        }
      }
    } else {
      resolve({ success: false, message: messages.fieldEmpty, result: {} });
    }
  });
}

function getUser(username) {
  return new Promise((resolve, reject) => {
    Users.findOne({ username })
      .then((user) => {
        if (user) {
          resolve(user);
        } else {
          resolve({});
        }
      })
      .catch((err) => resolve({}));
  });
}

module.exports = {
  getAllUser,
  signup,
  getUser,
  searchUser,
};
