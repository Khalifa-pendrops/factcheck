const axios = require('axios');
const winston = require('../utils/logger');
const config = require('../config/config');

class TranslationService {
  constructor() {
    this.baseUrl = config.translationServerUrl || 'http://localhost:3001';
  }


  async translateText(text, targetLanguage) {
    try {
      const response = await axios.post(`${this.baseUrl}/translate`, {
        text,
        targetLanguage
      });
      
      return response.data.translated;
    } catch (error) {
      winston.error(`Translation error: ${error.message}`, error);
      throw new Error(`Translation failed: ${error.message}`);
    }
  }


  async translateFactCheckResult(factCheckResult, targetLanguage) {
    try {
      if (targetLanguage === 'en') {
        return factCheckResult; 
      }
      
      // First translate the original content
      const translatedContent = await this.translateText(
        factCheckResult.content,
        targetLanguage
      );
      
      // Then translate each claim in the results
      const translatedResults = [];
      
      if (factCheckResult.results && factCheckResult.results.length) {
        for (const claim of factCheckResult.results) {
          const translatedClaim = {
            ...claim,
            text: claim.text ? await this.translateText(claim.text, targetLanguage) : '',
            claimant: claim.claimant ? await this.translateText(claim.claimant, targetLanguage) : '',
          };
          
          // Translate review information if available
          if (claim.claimReview && claim.claimReview.length) {
            translatedClaim.claimReview = await Promise.all(
              claim.claimReview.map(async (review) => {
                return {
                  ...review,
                  title: review.title ? await this.translateText(review.title, targetLanguage) : '',
                  textualRating: review.textualRating ? 
                    await this.translateText(review.textualRating, targetLanguage) : '',
                  snippet: review.snippet ? 
                    await this.translateText(review.snippet, targetLanguage) : ''
                };
              })
            );
          }
          
          translatedResults.push(translatedClaim);
        }
      }
      
      // Return a new object with translated content
      return {
        ...factCheckResult,
        content: translatedContent,
        results: translatedResults,
        translatedTo: targetLanguage,
        _original: { content: factCheckResult.content } 
      };
    } catch (error) {
      winston.error(`Failed to translate fact check result: ${error.message}`, error);
      // Return original content if translation fails
      return { ...factCheckResult, translationError: error.message };
    }
  }

  //Get list of supported languages
  async getSupportedLanguages() {
    try {
      const response = await axios.get(`${this.baseUrl}/languages`);
      return response.data.languages;
    } catch (error) {
      winston.error(`Failed to get supported languages: ${error.message}`, error);
      // Fallback to hardcoded languages if API fails
      return [
        { code: 'en', name: 'English' },
        { code: 'ha', name: 'Hausa' },
        { code: 'yo', name: 'Yoruba' },
        { code: 'ig', name: 'Igbo' }
      ];
    }
  }
}

module.exports = new TranslationService();