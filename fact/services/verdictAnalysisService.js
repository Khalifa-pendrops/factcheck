
const GoogleApiService = require("./googleApiService");

class VerdictAnalysisService {
  static async analyzeClaim(claim, language = "en") {
    try {
      const data = await GoogleApiService.searchClaims(claim, language);

      if (!data.claims || data.claims.length === 0) {
        return [
          {
            claim,
            verdict: "Unverifiable",
            confidence: 0,
            explanation: "No fact-checks found from trusted sources.",
            sources: [],
          },
        ];
      }

      const topClaim = data.claims[0];
      const review = topClaim.claimReview[0];

      return [
        {
          claim: topClaim.text,
          verdict: review.textualRating || "Unverifiable",
          confidence: 1,
          explanation: review.title || review.textualRating,
          sources: [
            {
              publisher: review.publisher?.name,
              url: review.url,
            },
          ],
        },
      ];
    } catch (error) {
      throw new Error(`Google Fact Check API failed: ${error.message}`);
    }
  }
}

module.exports = VerdictAnalysisService;
