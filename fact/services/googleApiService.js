const axios = require("axios");
const dotenv = require("dotenv");
const logger = require("../utils/logger");

dotenv.config();

class GoogleApiService {
  static async searchClaims(query, languageCode = "en") {
    try {
      const response = await axios.get(
        "https://factchecktools.googleapis.com/v1alpha1/claims:search",
        {
          params: {
            query,
            languageCode,
            key: process.env.GOOGLE_FACT_CHECK_API_KEY,
            pageSize: 3,
          },
          timeout: 10000,
        }
      );

      logger.debug("Google API Response:", {
        status: response.status,
        data: response.data,
      });

      return response.data;
    } catch (error) {
      logger.error("Google API Failed:", {
        error: error.response?.data || error.message,
        query,
        languageCode,
      });

      throw new Error(error.response?.data?.error?.message || error.message);
    }
  }
}

module.exports = GoogleApiService;
