const express = require("express");
const router = express.Router();
const factCheckController = require("../controllers/factCheckController");
const uploadController = require("../controllers/uploadController");
const fileUploadMiddleware = require("../middlewares/fileUpload");

router.post("/check", factCheckController.checkFact);

router.post("/upload", fileUploadMiddleware, uploadController.uploadImage);

router.get("/recent", factCheckController.getRecentChecks);

router.post("/check-offline", factCheckController.checkOfflineFact);

module.exports = router;
