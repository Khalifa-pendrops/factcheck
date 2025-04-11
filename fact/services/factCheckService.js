const FactCheck = require("../models/FactCheck");
const GoogleApiService = require("./googleApiService");

class FactCheckService {
  static async createFactCheck(inputType, content, ipAddress) {
    const factCheck = new FactCheck({
      inputType,
      content,
      ipAddress,
    });

    
    try {
      const results = await GoogleApiService.searchClaims(content);
      factCheck.results = results.claims || [];
    } catch (error) {
      factCheck.results = [];
    }

    await factCheck.save();
    return factCheck;
  }

  static async getRecentFactChecks(limit = 10) {
    return FactCheck.find().sort({ createdAt: -1 }).limit(limit).exec();
  }
}

module.exports = FactCheckService;
