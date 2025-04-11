const multer = require("multer");
const config = require("../config/config");
const winston = require("../utils/logger");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (config.allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: config.maxFileSize },
  fileFilter: fileFilter,
}).single("image");

module.exports = function (req, res, next) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      winston.error("Multer error:", err);
      return res.status(400).json({ error: err.message });
    } else if (err) {
      winston.error("File upload error:", err);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};
