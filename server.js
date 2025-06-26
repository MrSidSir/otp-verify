const express = require("express");
const cors = require('cors');

const dotenv = require("dotenv");
dotenv.config(); // ✅ MUST BE AT THE TOP, before using any env variable

const connectDB = require("./config/db");
connectDB(); // uses process.env.MONGO_URI

const authRoutes = require("./routes/authRoutes");
const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
