const winston = require("winston");

const logger = winston.createLogger({
  format: winston.format.colorize(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

module.exports = { logger };
