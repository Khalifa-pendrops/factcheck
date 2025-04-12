const mongoose = require("mongoose");
const winston = require("../utils/logger");

module.exports = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
    winston.info(`Connected to MongoDB...: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    winston.error("Could not connect to MongoDB...", err);
    process.exit(1);
  }
};
