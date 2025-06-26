const bcrypt = require("bcryptjs");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// Helper: Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Helper: Validate email format (simple regex)
const isValidEmail = (email) => /.+@.+\..+/.test(email);

// Signup: Register new user and send OTP
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpire: new Date(Date.now() + 10 * 60 * 1000),
      verified: false,
    });
    await newUser.save();
    await sendEmail(email, otp);
    return res.status(201).json({ message: "OTP sent to your email. Please verify to complete registration." });
  } catch (err) {
    console.error("Signup error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Request OTP: For login, send new OTP to existing user
const requestOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!isValidEmail(email)) return res.status(400).json({ message: "Invalid email format" });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    await sendEmail(email, otp);
    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Request OTP error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Verify OTP: Check OTP, expiry, mark verified, clear OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.otp || !user.otpExpire) return res.status(400).json({ message: "No OTP requested. Please request a new OTP." });
    if (user.otpExpire < new Date()) return res.status(400).json({ message: "OTP expired. Please request a new OTP." });
    if (String(user.otp) !== String(otp)) return res.status(400).json({ message: "Invalid OTP" });
    user.verified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();
    return res.status(200).json({ message: "OTP verified successfully. You are now logged in.", user: { username: user.username, email: user.email, verified: user.verified } });
  } catch (err) {
    console.error("Verify OTP error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  signup,
  requestOTP,
  verifyOTP,
};
