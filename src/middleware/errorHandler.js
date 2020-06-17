const { logger } = require("../services/winston");
const errors = require("./errors.json");
const defaultError = {
  errorCode: "Unknown",
  developerMessage: "Unknown error found, debug and add to error cases",
  userMessages: "",
  statusCode: 500
};

/* eslint-disable */
const errorHandler = (err, req, res, next) => {
    /* eslint-enable */
  logger.error(`Application error handled...`);
  const errorDetail = errors.find((error) => {
    return error.name === err.name;
  });
  const errorToSend = errorDetail
    ? {
        errorCode: errorDetail.code,
        developerMessage: errorDetail.developerMessage,
        userMessages: errorDetail.userMessages,
        statusCode: errorDetail.statusCode
      }
    : defaultError;

  errorToSend.rawError = err.rawError || "none";
  res.status(errorToSend.statusCode);
  res.send(errorToSend);
};

module.exports = { errorHandler };
