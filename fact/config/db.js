const mongoose = require("mongoose");
const winston = require("../utils/logger");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    winston.info("Connected to MongoDB...");
  } catch (err) {
    winston.error("Could not connect to MongoDB...", err);
    process.exit(1);
  }
};
