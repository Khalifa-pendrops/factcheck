const FactCheck = require("../models/FactCheck");
const VerdictAnalysisService = require("./verdictAnalysisService");
const logger = require("../utils/logger");

class FactCheckService {
  static async createFactCheck(inputType, content, ipAddress, language = "en") {
    const factCheck = new FactCheck({
      inputType,
      content,
      ipAddress,
      results: [],
    });

    try {
      const analysis = await VerdictAnalysisService.analyzeClaim(
        content,
        language
      );
      factCheck.results = analysis;

      logger.info(`Fact-checked: ${content}`, {
        verdict: analysis[0]?.verdict,
        confidence: analysis[0]?.confidence,
      });
    } catch (error) {
      logger.error("Fact-check failed:", {
        error: error.message,
        content,
        stack: error.stack,
      });

      factCheck.results = [
        {
          claim: content,
          verdict: "Unverifiable",
          confidence: 0,
          explanation: `Error during fact-checking: ${error.message}`,
        },
      ];
    }

    await factCheck.save();
    return factCheck;
  }

  static async getRecentFactChecks() {
    return await FactCheck.find().sort({ createdAt: -1 }).limit(10);
  }
}

module.exports = FactCheckService;

