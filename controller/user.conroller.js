const userAdapter = require("../adapter/user.adapter");

// GET
// get all user
exports.getAllUser = async (request, response) => {
  const userConnected = request.user._doc;
  const result = await userAdapter.getAllUser(userConnected);
  response.json(result);
};
exports.getUser = async (request, response) => {
  const { username } = request.body;
  const result = await userAdapter.getUser(username);
  response.json(result);
};
exports.logout = (request, response, next) => {
  request.logOut((err) => {
    if (err) return next(err);
    response.json({ success: true, message: "You are out now.", result: {} });
  });
};
exports.searchUser = async (request, response) => {
  const { search } = request.query;
  const userConnected = request.user._doc;
  const result = await userAdapter.searchUser(search, userConnected);
  response.json(result);
};

// POST
exports.login = async (request, response) => {
  const result = await userAdapter.login(request.body);
  response.json(result);
};
exports.signup = async (request, response) => {
  const result = await userAdapter.signup(request.body);
  response.json(result);
};
