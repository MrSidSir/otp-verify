const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config(); // ✅ Load env variables at the top

const app = express();

// ✅ Database connection
connectDB();

// ✅ Middlewares
app.use(express.json());

// Allow requests from your frontend URL in production
app.use(
  cors({
    origin: "https://otp-frontend-alpha.vercel.app", // your Vercel frontend URL
    credentials: true,
  })
);

// ✅ Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
