const express = require('express');
const cors = require('cors');
const { pipeline } = require('@huggingface/inference');
const winston = require('./utils/logger');

const app = express();
app.use(cors());
app.use(express.json());

// Configuration
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const PORT = process.env.TRANSLATION_SERVER_PORT || 3001;

// Define language-specific models
const LANGUAGE_MODELS = {
  ha: 'Helsinki-NLP/opus-mt-en-ha',  // English to Hausa
  yo: 'masakhane/opus-mt-en-yo',     // English to Yoruba
  ig: 'masakhane/opus-mt-en-ig'      // English to Igbo (if available)
};

// Handler for translation requests
app.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    if (!targetLanguage || !LANGUAGE_MODELS[targetLanguage]) {
      return res.status(400).json({ 
        error: 'Unsupported target language',
        supportedLanguages: Object.keys(LANGUAGE_MODELS)
      });
    }
    
    // Use Hugging Face inference API with the appropriate model
    const result = await pipeline('translation', LANGUAGE_MODELS[targetLanguage], {
      inputs: text,
      options: { use_cache: true },
      apiKey: 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
    });
    
    res.json({ 
      original: text,
      translated: result[0].translation_text,
      language: targetLanguage 
    });
    
  } catch (error) {
    winston.error(`Translation error: ${error.message}`, error);
    res.status(500).json({ error: 'Translation failed', details: error.message });
  }
});

// Get available languages
app.get('/languages', (req, res) => {
  try {
    const languages = [
      { code: 'en', name: 'English' },
      { code: 'ha', name: 'Hausa' },
      { code: 'yo', name: 'Yoruba' },
      { code: 'ig', name: 'Igbo' }
    ].filter(lang => lang.code === 'en' || LANGUAGE_MODELS[lang.code]);
    
    res.json({ languages });
  } catch (error) {
    winston.error(`Error getting languages: ${error.message}`, error);
    res.status(500).json({ error: 'Failed to retrieve languages' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  winston.info(`Translation server running on port ${PORT}`);
});

module.exports = app; // For testing purposes