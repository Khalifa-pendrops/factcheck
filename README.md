# TruthCheck Backend API

A fact-checking platform for verifying news authenticity in Nigeria

## Table of Contents

- Overview

- Features

- Technology Stack

- API Documentation

- Installation

- Configuration

- Running the Application

- Testing

- Deployment

- Project Structure

- Contributing

---

## Overview

This application provides a RESTful API for fact-checking text, URLs, and images. It leverages the Google Fact Check Tools API to verify claims and includes translation capabilities for Igbo, Yoruba, and Hausa languages using open-source machine learning models.

---

## Features

1. Text-based fact checking.

2. URL content fact checking.

3. Image-based fact checking (with text extraction).

4. Multi-language Support: Content available in English, Yoruba, Igbo, and Hausa

5. Official Database Integration: Verification against trusted sources

6. Offline Functionality: Downloadable content for offline verification

7. API rate limiting and security measures

8. Caching: Redis-based caching for improved performance

9. Comprehensive logging and error handling

---

## System Architecture

The application consists of two main components:

1. Main Application: A Node.js/Express API that handles fact checking requests and database operations

2. Translation Server: A separate service that provides translation capabilities using Hugging Face models

---

## Prerequisites

1. Node.js 14+ and npm

2. MongoDB instance (local or Atlas)

3. Google Fact Check API key

4. Hugging Face API key (for translations)

5. Tesseract.js (for image text extraction)

---

## Installation

- Clone the repository

git clone `https://github.com/yourusername/factcheck.git`

cd factcheck

- Install dependencies

npm install

- Create a .env file in the root directory

PORT=5000
MONGODB_URI=mongodb+srv://your_connection_string
GOOGLE_FACT_CHECK_API_KEY=your_google_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
TRANSLATION_SERVER_PORT=3001
TRANSLATION_SERVER_URL=`http://localhost:3001`

---

## Usage

### Starting the Application

Start the main application:

npm start

Start the translation server:

npm run translation-server

---

## API Endpoints

### Fact Checking

POST /api/check - Check a fact from text or URL

Body: { "text": "Earth is flat" } or `{ "url": "https://example.com/article" }`

POST /api/upload - Check facts from an image

Form data: image file upload

GET /api/recent - Get recent fact checks

---

## Translation

GET /api/languages - Get supported languages
GET /api/translate/:factCheckId/:targetLanguage - Translate a fact check result

Example: /api/translate/6123456789abcdef12345678/yo

POST /api/translate/text - Translate text

Body: { "text": "Hello world", "targetLanguage": "ha" }

Example Usage

- Check a fact
curl.exe -X POST `http://localhost:5000/api/check \`
  -H "Content-Type: application/json" \
  -d '{"text": "The earth is flat"}'

- Translate a fact check to Yoruba
curl.exe -X GET `http://localhost:5000/api/translate/6123456789abcdef12345678/yo`

---

## Development

### Running in Development Mode

npm run dev

### Testing

npm test

Test coverage includes:

- Claim submission and retrieval

- Verification workflows

- Error handling

---

## API Documentation

Comprehensive API documentation is available via Swagger UI when the application is running:

`(http://localhost:5000/api-docs)`

The documentation includes:

- All available endpoints

- Request/response examples

- Authentication requirements

- Error codes

---

## Project Structure

factcheck/fact
├── config/            # Configuration files
├── controllers/       # Request handlers
├── middlewares/       # Express middlewares
├── models/            # Database models
├── routes/            # API routes
├── services/          # Business logic
├── uploads/           # Uploaded files (images)
├── utils/             # Utility functions
├── translationServer.js  # Translation service
├── server.js          # Main application entry point
└── README.md          # This file

---

## Known Issues and Limitations

Translation models for Nigerian languages are still evolving and may not be perfect
Image text extraction works best with clear, high-resolution images
Google Fact Check API may not cover all topics or claims

Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

Please ensure your code follows the style guidelines and includes appropriate tests.
