
const mongoose = require("mongoose");

let user = new mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  fav_stops: [{ type: String }],
  comments: [{ type: String }],
});

let User = mongoose.model("User", user);

module.exports = User;
