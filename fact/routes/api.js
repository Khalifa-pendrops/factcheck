const express = require("express");
const router = express.Router();
const factCheckController = require("../controllers/factCheckController");
const uploadController = require("../controllers/uploadController");
const translationController = require("../controllers/translationController");
const fileUploadMiddleware = require("../middlewares/fileUpload");

router.post("/check", factCheckController.checkFact);
router.post("/upload", fileUploadMiddleware, uploadController.uploadImage);
router.get("/recent", factCheckController.getRecentChecks);

// translation routes
router.get("/languages", translationController.getSupportedLanguages);
router.get("/translate/:factCheckId/:targetLanguage", translationController.translateFactCheck);
router.post("/translate/text", translationController.translateText);

module.exports = router;