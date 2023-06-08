const express = require("express");
const passport = require("passport");
const router = express.Router();
const messageController = require("../controller/message.controller");

router.get(
  "/open/:chatId",
  passport.authenticate("jwt", { session: false }),
  messageController.openMessage
);
router.post(
  "/send",
  passport.authenticate("jwt", { session: false }),
  messageController.sendMessage
);

module.exports = router;
