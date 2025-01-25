const mongoose = require("mongoose");
require("dotenv").config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.URI, {
      dbName: "Speakx",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB🚀🚀");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

module.exports = connectDB;
