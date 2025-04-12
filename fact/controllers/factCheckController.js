const FactCheckService = require("../services/factCheckService");
const OfflineCheckService = require("../services/offlineCheckService");
const winston = require("../utils/logger");

exports.checkFact = async (req, res, next) => {
  try {
    const { text, url, language } = req.body;
    const ipAddress = req.ip;

    let inputType, content;

    if (text) {
      inputType = "text";
      content = text;
    } else if (url) {
      inputType = "url";
      content = url;
    } else {
      return res.status(400).json({ error: "Either text or URL is required" });
    }

    const factCheck = await FactCheckService.createFactCheck(
      inputType,
      content,
      ipAddress,
      language || "en" // fallback to English if other languages are not supported
    );

    res.json(factCheck);
  } catch (error) {
    winston.error("Error in checkFact:", error);
    next(error);
  }
};

exports.checkOfflineFact = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res
        .status(400)
        .json({ error: "Text is required for offline check" });
    }

    const matches = OfflineCheckService.searchClaims(text);

    if (matches.length === 0) {
      return res.status(404).json({
        message:
          "No offline match found. Try online or update your local dataset.",
        results: [],
      });
    }

    return res.json({
      inputType: "text",
      content: text,
      source: "offline",
      results: matches,
    });
  } catch (error) {
    next(error);
  }
};

exports.getRecentChecks = async (req, res, next) => {
  try {
    const recentChecks = await FactCheckService.getRecentFactChecks();
    res.json(recentChecks);
  } catch (error) {
    winston.error("Error in getRecentChecks:", error);
    next(error);
  }
};
