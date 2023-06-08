const messageAdapter = require("../adapter/message.adapter");

exports.sendMessage = async (request, response) => {
  const userConnected = request.user._doc;
  const result = await messageAdapter.sendMessage(request.body, userConnected);
  response.json(result);
};

exports.openMessage = async (request, response) => {
  const { chatId } = request.params;
  const result = await messageAdapter.openMessage(chatId);
  response.json(result);
};
