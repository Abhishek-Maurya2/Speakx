require("dotenv").config();
// Add this at the very top of your index.j
process.env.NODE_NO_WARNINGS = "1";

const express = require("express");
const connectDB = require("./db");
const questionsRoute = require("./routes/questions");
const cors = require("cors");
const { startGrpcServer } = require("./grpc_server.js"); // Modified import

// Database connection
connectDB();

// Express setup
const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/questions", questionsRoute);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start servers
const PORT = 5000;
app.listen(PORT, async () => {
  console.log("REST server running on port 5000 🚀");

  // Start gRPC server after REST server is running
  try {
    await startGrpcServer();
    console.log("gRPC server running on port 50051 🚀");
  } catch (err) {
    console.error("Failed to start gRPC server:", err);
    process.exit(1);
  }
});
