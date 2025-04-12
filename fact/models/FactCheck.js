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

  results: [
    {
      claim: String,
      claimDate: Date,
      claimant: String,
      verdict: {
        type: String,
        enum: [
          "True",
          "Mostly True",
          "Mixture",
          "Mostly False",
          "False",
          "Misleading",
          "Unverified",
          "Unverifiable",
          "Outdated",
          "Satire",
        ],
        required: true,
      },
      confidence: {
        type: Number,
        min: 0,
        max: 100,
        default: 80,
      },
      sources: [
        {
          publisher: String,
          url: String,
          reviewDate: Date,
        },
      ],
      explanation: String,
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },

  ipAddress: {
    type: String,
  },
});

module.exports = mongoose.model("FactCheck", factCheckSchema);
