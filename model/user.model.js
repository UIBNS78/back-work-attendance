const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    firstName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    picture: {
      type: String,
      required: true,
      default:
        "https://www.seekpng.com/png/full/41-410093_circled-user-icon-user-profile-icon-png.png",
    },
    created_at: { type: Date, default: Date.now },
  },
  { timestamp: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
