const axios = require("axios");
const config = require("../config/config");
const winston = require("../utils/logger");

class GoogleApiService {
  static async searchClaims(query, language = "en") {
    try {
      const response = await axios.get(config.googleFactCheckApiUrl, {
        params: {
          query,
          languageCode: language,
          key: config.googleFactCheckApiKey,
        },
      });
      return response.data;
    } catch (error) {
      winston.error("Google Fact Check API error:", error);
      throw error;
    }
  }
}

module.exports = GoogleApiService;
