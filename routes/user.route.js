const express = require("express");
const router = express.Router();
const userContoller = require("../controller/user.conroller");
const passport = require("passport");

// GET METHODS
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  userContoller.getAllUser
);
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  userContoller.searchUser
);
router.get("/logout", userContoller.logout);

// POST METHODS
router.post("/login", (request, response, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (user) {
      request.logIn(user, (err) => {
        if (err) throw err;
      });
      response.json({
        success: true,
        message: `Welcome ${user.name}`,
        result: user,
      });
    } else {
      response.json({ success: false, message: info.message, result: {} });
    }
  })(request, response, next);
});
router.post("/signup", userContoller.signup);

module.exports = router;
