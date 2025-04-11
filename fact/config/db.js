const mongoose = require("mongoose");
const winston = require("../utils/logger");


module.exports = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    winston.info(`Connected to MongoDB... 🎉: ${conn.connection.host}`);
  } catch (err) {
    winston.error("Could not connect to MongoDB... ⛔", err);
    process.exit(1);
  }
};
