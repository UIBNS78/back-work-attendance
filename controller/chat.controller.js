const chatAdapter = require("../adapter/chat.adapter");

exports.open = async (request, response) => {
  const userConnected = request.user._doc;
  const result = await chatAdapter.open(request.body, userConnected);
  response.json(result);
};

exports.fetchChats = async (request, response) => {
  const userConnected = request.user._doc;
  const result = await chatAdapter.fetchChats(userConnected);
  response.json(result);
};

exports.createGroup = async (request, response) => {
  const userConnected = request.user._doc;
  const result = await chatAdapter.createGroup(request.body, userConnected);
  response.json(result);
};

exports.renameGroup = async (request, response) => {
  const userConnected = request.user._doc;
  const result = await chatAdapter.renameGroup(request.body, userConnected);
  response.json(result);
};

exports.addToGroup = async (request, response) => {
  const result = await chatAdapter.addToGroup(request.body);
  response.json(result);
};

exports.removeToGroup = async (request, response) => {
  const result = await chatAdapter.removeToGroup(request.body);
  response.json(result);
};
