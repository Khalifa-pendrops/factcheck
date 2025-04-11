const FactCheckService = require("../services/factCheckService");
const winston = require("../utils/logger");
const { extractTextFromImage } = require("../utils/helpers");

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const ipAddress = req.ip;

    const extractedText = await extractTextFromImage(req.file.path);

    const factCheck = await FactCheckService.createFactCheck(
      "image",
      extractedText,
      ipAddress
    );

    res.json(factCheck);
  } catch (error) {
    winston.error("Error in uploadImage:", error);
    next(error);
  }
};
