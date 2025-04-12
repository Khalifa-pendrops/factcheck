const TranslationService = require('../services/translationService');
const FactCheckService = require('../services/factCheckService');
const winston = require('../utils/logger');

exports.getSupportedLanguages = async (req, res) => {
  try {
    const languages = await TranslationService.getSupportedLanguages();
    res.json({ languages });
  } catch (error) {
    winston.error('Error getting supported languages:', error);
    res.status(500).json({ error: 'Failed to get supported languages' });
  }
};

exports.translateFactCheck = async (req, res, next) => {
  try {
    const { factCheckId, targetLanguage } = req.params;
    
    if (!factCheckId) {
      return res.status(400).json({ error: 'Fact check ID is required' });
    }
    
    if (!targetLanguage) {
      return res.status(400).json({ error: 'Target language is required' });
    }
    
    // Get original fact check result
    const factCheck = await FactCheckService.getFactCheckById(factCheckId);
    
    if (!factCheck) {
      return res.status(404).json({ error: 'Fact check not found' });
    }
    
    // Translate the fact check result
    const translatedFactCheck = await TranslationService.translateFactCheckResult(
      factCheck,
      targetLanguage
    );
    
    res.json(translatedFactCheck);
  } catch (error) {
    winston.error('Error in translateFactCheck:', error);
    next(error);
  }
};

exports.translateText = async (req, res, next) => {
  try {
    const { text, targetLanguage } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    if (!targetLanguage) {
      return res.status(400).json({ error: 'Target language is required' });
    }
    
    const translatedText = await TranslationService.translateText(text, targetLanguage);
    
    res.json({ 
      original: text, 
      translated: translatedText, 
      language: targetLanguage 
    });
  } catch (error) {
    winston.error('Error in translateText:', error);
    next(error);
  }
};