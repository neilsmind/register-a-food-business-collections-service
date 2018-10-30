const errorHandler = (err, req, res, next) => {
  res.status(500);
  res.send({
    errorCode: "Unknown",
    developerMessage: "Unknown error found, debug and add to error cases",
    userMessages: ""
  });
};

module.exports = { errorHandler };
