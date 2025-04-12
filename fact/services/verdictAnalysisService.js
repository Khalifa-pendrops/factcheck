const natural = require("natural");
const { SentimentAnalyzer } = require("natural");
const GoogleApiService = require("./googleApiService");

class VerdictAnalysisService {
  static async analyzeClaim(claimText) {
    const googleResults = await GoogleApiService.searchClaims(claimText);

    const normalizedClaims = this._normalizeGoogleResults(googleResults);

    return this._applyVerdictLogic(normalizedClaims, claimText);
  }

  static _normalizeGoogleResults(googleData) {
    return googleData.claims.map((claim) => ({
      claim: claim.text,
      claimant: claim.claimant || "Unknown",
      claimDate: claim.claimDate || new Date(),
      publisher: claim.publisher?.name || "Unknown",
      reviewDate: claim.reviewDate || new Date(),
      rating: claim.claimReview?.[0]?.textualRating || "Unverified",
      url: claim.claimReview?.[0]?.url || "",
    }));
  }

  static _applyVerdictLogic(claims, originalClaim) {
    if (claims.length === 0) {
      return [
        {
          claim: originalClaim,
          verdict: "Unverifiable",
          confidence: 0,
          explanation: "No independent verification found",
        },
      ];
    }

    const sentiment = new SentimentAnalyzer("English");
    // const claimSentiment = sentiment.getSentiment(originalClaim.split(" "));

    return claims.map((claim) => {
      const standardizedVerdict = this._standardizeVerdict(claim.rating);

      const confidence = this._calculateConfidence(
        standardizedVerdict,
        claim.publisher,
        claim.reviewDate
      );

      return {
        ...claim,
        verdict: standardizedVerdict,
        confidence,
        sources: [
          {
            publisher: claim.publisher,
            url: claim.url,
            reviewDate: claim.reviewDate,
          },
        ],
        explanation: this._generateExplanation(standardizedVerdict, claim),
      };
    });
  }

  static _standardizeVerdict(googleRating) {
    const rating = googleRating.toLowerCase();

    const verdictMap = {
      true: "True",
      "mostly true": "Mostly True",
      "half true": "Mixture",
      mixture: "Mixture",
      "mostly false": "Mostly False",
      false: "False",
      "pants on fire": "False",
      misleading: "Misleading",
      unverified: "Unverified",
      satire: "Satire",
    };

    return verdictMap[rating] || "Unverifiable";
  }

  static _calculateConfidence(verdict, publisher, reviewDate) {
    let score = 80;

    const crediblePublishers = ["factcheck.org", "politifact", "snopes"];
    if (crediblePublishers.includes(publisher.toLowerCase())) {
      score += 15;
    }

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    if (new Date(reviewDate) > oneYearAgo) {
      score += 10;
    }

    return Math.min(score, 100);
  }

  static _generateExplanation(verdict, claim) {
    const explanations = {
      True: `'${claim.claim}' is factually accurate according to ${claim.publisher}.`,
      "Mostly True": `"${claim.claim}" is largely accurate but may lack context.`,
      Mixture: `This claim contains both true and false elements.`,
      "Mostly False": `"${claim.claim}" contains significant inaccuracies.`,
      False: `"${claim.claim}" has been conclusively disproven.`,
      Misleading: `This claim presents facts out of context to distort meaning.`,
      Unverified: `No authoritative sources have verified this claim.`,
      Unverifiable: `Insufficient evidence exists to confirm or deny this claim.`,
    };

    return (
      explanations[verdict] || "This claim requires further investigation."
    );
  }
}

module.exports = VerdictAnalysisService;
