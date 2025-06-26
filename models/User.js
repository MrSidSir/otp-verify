const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: String,
  otpExpire: Date,
  verified: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
