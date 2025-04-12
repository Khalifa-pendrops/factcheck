const axios = require("axios");
const config = require("../config/config");

class GoogleApiService {
  static async searchClaims(query, language = "en") {
    try {
      const response = await axios.get(config.googleFactCheckApiUrl, {
        params: {
          query,
          languageCode: language,
          key: config.googleFactCheckApiKey,
          pageSize: 5,
        },
        timeout: 5000,
      });

      return this._filterValidClaims(response.data);
    } catch (error) {
      console.error("Google API Error:", error.response?.data || error.message);
      return { claims: [] };
    }
  }

  static _filterValidClaims(data) {
    if (!data || !Array.isArray(data.claims)) return { claims: [] };

    return {
      claims: data.claims
        .filter((claim) => {
          return (
            claim?.text &&
            claim.claimReview?.[0]?.textualRating &&
            claim.claimReview[0].url
          );
        })
        .slice(0, 5), 
    };
  }
}
