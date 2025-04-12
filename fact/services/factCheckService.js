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

  static async getFactCheckById(id) {
    if (!id) return null;
    try {
      return await FactCheck.findById(id).exec();
    } catch (error) {
      winston.error(`Error retrieving fact check by ID ${id}:`, error);
      throw error;
    }
  }
}

module.exports = FactCheckService;
