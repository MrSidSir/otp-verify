const express = require("express");
const router = express.Router();
const {
  signup,
  requestOTP,
  verifyOTP,
} = require("../controllers/authController");

// Register new user and send OTP
router.post("/signup", signup);
// Request OTP for login (existing user)
router.post("/login/otp", requestOTP);
// Verify OTP and login
router.post("/login/verify", verifyOTP);

module.exports = router;
