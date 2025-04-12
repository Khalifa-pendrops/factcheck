const FactCheck = require("../models/FactCheck");
// const GoogleApiService = require("./googleApiService");
const VerdictAnalysisService = require("../services/verdictAnalysisService");

class FactCheckService {
  static async createFactCheck(inputType, content, ipAddress) {
    const factCheck = new FactCheck({
      inputType,
      content,
      ipAddress,
    });

    try {
      factCheck.results = await VerdictAnalysisService.analyzeClaim(content);
    } catch (error) {
      factCheck.results = [
        // watch here!
        {
          claim: content,
          verdict: "Unverifiable",
          confidence: 0,
          explanation: "Error during fact-checking analysis.",
        },
      ];
    }

    await factCheck.save();
    return factCheck;
  }

  static async getRecentFactChecks(limit = 10) {
    return FactCheck.find().sort({ createdAt: -1 }).limit(limit).exec();
  }
}

module.exports = FactCheckService;
