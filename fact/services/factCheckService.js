const FactCheck = require("../models/FactCheck");
const VerdictAnalysisService = require("./verdictAnalysisService");
const OfflineCheckService = require("./offlineCheckService");
const logger = require("../utils/logger");

// Function to normalize the sources to an array of objects
function normalizeSources(sources) {
  if (!Array.isArray(sources)) {
    // If it's a string or a single object, wrap it in an array
    return [
      typeof sources === "string" ? { publisher: sources } : sources || {},
    ];
  }

  // Otherwise, ensure the sources array contains objects with the required fields
  return sources.map((source) => {
    if (typeof source === "string") {
      return { publisher: source };
    }

    return {
      publisher: source.publisher || "Unknown Publisher",
      url: source.url || "",
      reviewDate: source.reviewDate ? new Date(source.reviewDate) : null,
    };
  });
}
class FactCheckService {
  static async createFactCheck(inputType, content, ipAddress) {
    const factCheck = new FactCheck({
      inputType,
      content,
      ipAddress,
      results: [],
    });

    try {
      // First try online Google + Internal check
      const analysis = await VerdictAnalysisService.analyzeClaim(content);

      factCheck.results = analysis.map((result) => ({
        //this part and the function above the class aligns the response data structure with the expected source (from the model)
        ...result,
      }));

      logger.info(`✅ Online fact-check success: ${content}`, {
        verdict: analysis[0]?.verdict,
        confidence: analysis[0]?.confidence,
      });
    } catch (error) {
      logger.warn("⚠️ Online check failed, falling back to offline:", {
        error: error.message,
        content,
      });

      // Use OfflineCheckService as fallback if no internet access
      const offlineMatches = OfflineCheckService.searchClaims(content);
      if (offlineMatches.length > 0) {
        factCheck.results = offlineMatches.map((match) => ({
          claim: content,
          verdict: match.verdict || "Likely",
          confidence: match.confidence || 0.7,
          explanation:
            match.explanation || `Matched with local claim: "${match.text}"`,
          sources: match.sources || [],
        }));
      } else {
        factCheck.results = [
          {
            claim: content,
            verdict: "Unverifiable",
            confidence: 0,
            explanation: "No relevant offline match found.",
            sources: [],
          },
        ];
      }
    }

    await factCheck.save();
    return factCheck;
  }

  static async getRecentFactChecks(limit = 10) {
    return FactCheck.find().sort({ createdAt: -1 }).limit(limit);
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
