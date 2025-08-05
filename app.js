const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/auth_routes");
const postRoutes = require("./routes/post_routes");
const commentRoutes = require("./routes/comment_routes");

// Init App
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Blog Platform API is running ✅");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("[Error]", err.message);
  res.status(500).json({
    success: false,
    error: err.message || "Something went wrong",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
