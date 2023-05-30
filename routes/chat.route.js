const express = require("express");
const passport = require("passport");
const router = express.Router();
const chatController = require("../controller/chat.controller");

// GET
router.get(
  "/fetch",
  passport.authenticate("jwt", { session: false }),
  chatController.fetchChats
);

// POST
router.post(
  "/open",
  passport.authenticate("jwt", { session: false }),
  chatController.open
);
router.post(
  "/group/create",
  passport.authenticate("jwt", { session: false }),
  chatController.createGroup
);
router.post(
  "/group/add-user",
  passport.authenticate("jwt", { session: false }),
  chatController.addToGroup
);
router.post(
  "/group/remove-user",
  passport.authenticate("jwt", { session: false }),
  chatController.removeToGroup
);

// PUT
router.put(
  "/group/rename",
  passport.authenticate("jwt", { session: false }),
  chatController.renameGroup
);

module.exports = router;
