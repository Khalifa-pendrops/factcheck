const winston = require("../utils/logger");

module.exports = function (err, req, res, next) {
  winston.error(err.messsage, err);

  res.status(500).json({
    error: "Hey! Something went wrong on the server 😞",
  });
};
