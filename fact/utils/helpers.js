const Tesseract = require("tesseract.js");
const winston = require("./logger");

exports.extractTextFromImage = async (imagePath) => {
  try {
    const {
      data: { text },
    } = await Tesseract.recognize(imagePath, "eng", {
      logger: (m) => winston.debug(m),
    });
    return text;
  } catch (err) {
    winston.error("Error extracting text from image: ", err);
  }
};
