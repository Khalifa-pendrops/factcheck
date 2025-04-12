const winston = require("../utils/logger");

module.exports = function (err, req, res, next) {
  winston.error(err.messsage, err);
  console.log(err.stack);

  res.status(err.status || 500).json({
    error: err.message || "Hey! Something went wrong on the server 😞", 
  });
};
