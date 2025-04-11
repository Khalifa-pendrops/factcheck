const mongoose = require("mongoose");

const factCheckSchema = new mongoose.Schema({
  inputType: {
    type: String,
    enum: ["text", "url", "image"],
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  results: {
    type: [],
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  ipAddress: {
    type: String,
  },
});

module.exports = mongoose.model("FactCheck", factCheckSchema);
