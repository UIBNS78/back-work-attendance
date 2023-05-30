const Chat = require("../model/chat.model");
const User = require("../model/user.model");

function open(data, userConnected) {
  return new Promise(async (resolve, reject) => {
    const { userId } = data;
    if (userId) {
      let resultChat = await Chat.find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: userConnected._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
        .populate("users", "-password")
        .populate("latestMessage");

      resultChat = await User.populate(resultChat, {
        path: "latestMessage.sender",
        select: "name firstName username picture",
      });

      if (resultChat.length > 0) {
        resolve({
          success: true,
          message: "",
          result: { chat: resultChat[0] },
        });
      } else {
        // create chat
        const chatData = {
          chatName: "sender",
          users: [userConnected._id, userId],
        };
        try {
          const chatCreate = await Chat.create(chatData);
          const chatCreated = await Chat.find({ _id: chatCreate._id }).populate(
            "users",
            "-password"
          );
          resolve({
            success: true,
            message: "",
            result: { chat: chatCreated },
          });
        } catch (err) {
          console.log(err);
          resolve({ success: false, message: err.message, result: {} });
        }
      }
    } else {
      resolve({ success: false, message: "User target is empty" });
    }
  });
}

function fetchChats(userConnected) {
  return new Promise((resolve, reject) => {
    Chat.find({ users: { $elemMatch: { $eq: userConnected } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ createdAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMessage.sender",
          select: "name firstName username picture",
        });
        resolve({ success: true, message: "", result: { chat: result } });
      });
  });
}

function createGroup(data, userConnected) {
  return new Promise(async (resolve, reject) => {
    if (!data.chatName || !data.users) {
      resolve({
        success: false,
        message: "Make sure you've filled all the required fields.",
        result: {},
      });
    } else if (data.users.length < 2) {
      resolve({
        success: false,
        message: "Group has to be more than 2 users.",
        result: {},
      });
    } else {
      const { chatName, users } = data;
      users.push(userConnected._id);
      try {
        const chatCreate = await Chat.create({
          chatName,
          isGroupChat: true,
          users,
          groupAdmin: userConnected._id,
        });
        const chatCreated = await Chat.findOne({ _id: chatCreate._id })
          .populate("users", "-password")
          .populate("groupAdmin", "-password");
        resolve({ success: true, message: "", result: { chat: chatCreated } });
      } catch (err) {
        console.log(err);
        resolve({ success: false, message: err.message, result: {} });
      }
    }
    console.log("object");
  });
}

function renameGroup(data, userConnected) {
  return new Promise(async (resolve, reject) => {
    const { chatId, chatName } = data;
    if (!chatId || !chatName) {
      resolve({ success: false, message: "Fields are not correct." });
    } else {
      const chatUpdated = await Chat.findByIdAndUpdate(
        chatId,
        { chatName },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      if (chatUpdated) {
        resolve({ success: true, message: "", result: { chat: chatUpdated } });
      } else {
        resolve({ success: false, message: "Chat not found.", result: {} });
      }
    }
  });
}

function addToGroup(data) {
  return new Promise(async (resolve, reject) => {
    const { chatId, users } = data;
    if (!chatId || !users) {
      resolve({
        success: false,
        message: "The data sent are not correct.",
        result: {},
      });
    } else {
      const added = await Chat.findByIdAndUpdate(
        chatId,
        { $push: { users: users } },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      if (added) {
        resolve({
          success: true,
          message: "",
          result: { chat: added },
        });
      } else {
        resolve({
          success: false,
          message: "Can't add user in the chat.",
          result: {},
        });
      }
    }
  });
}

function removeToGroup(data) {
  return new Promise(async (resolve, reject) => {
    const { chatId, users } = data;
    if (!chatId || !users) {
      resolve({
        success: false,
        message: "The data sent are not correct.",
        result: {},
      });
    } else {
      const removed = await Chat.findByIdAndUpdate(
        chatId,
        { $pull: { users: users } },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
      if (removed) {
        resolve({
          success: true,
          message: "",
          result: { chat: removed },
        });
      } else {
        resolve({
          success: false,
          message: "Can't remove user in the chat.",
          result: {},
        });
      }
    }
  });
}

module.exports = {
  open,
  fetchChats,
  createGroup,
  renameGroup,
  addToGroup,
  removeToGroup,
};
