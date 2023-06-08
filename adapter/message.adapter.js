const Chat = require("../model/chat.model");
const Message = require("../model/message.model");
const User = require("../model/user.model");

function sendMessage(data, userConnected) {
  return new Promise(async (resolve, reject) => {
    const { content, chatId } = data;
    if (content && chatId) {
      const newMessage = {
        sender: userConnected._id,
        content,
        chat: chatId,
      };
      try {
        let messageCreate = await Message.create(newMessage);
        messageCreate = await messageCreate.populate("sender", "name picture");
        messageCreate = await messageCreate.populate("chat");
        messageCreate = await User.populate(messageCreate, {
          path: "chat.users",
          select: "name picture",
        });
        await Chat.findByIdAndUpdate(chatId, { latestMessage: messageCreate });
        resolve({ succes: true, message: "", result: messageCreate });
      } catch (error) {
        resolve({ success: false, message: "Can't send message.", result: {} });
      }
    } else {
      resolve({
        success: false,
        message: "Data sent are not valid.",
        result: {},
      });
    }
  });
}

function openMessage(chatId) {
  return new Promise(async (resolve, reject) => {
    if (chatId) {
      try {
        const messages = await Message.find({ chat: chatId })
          .populate("sender", "name picture")
          .populate("chat");
        resolve({ success: true, message: "", result: messages });
      } catch (error) {
        resolve({ success: false, message: error.message, result: {} });
      }
    } else {
      resolve({
        success: false,
        message: "Data sent are not valid.",
        result: {},
      });
    }
  });
}

module.exports = {
  sendMessage,
  openMessage,
};
