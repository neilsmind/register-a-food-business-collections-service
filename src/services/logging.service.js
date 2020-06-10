const EventEmitter = require("events");
const {logger} = require("./winston");

class LogEmitter extends EventEmitter {}

const logEmitter = new LogEmitter();

logEmitter.on("functionCall", (module, functionName) => {
  logger.info(`${module}: ${functionName} called`);
});

logEmitter.on("functionSuccess", (module, functionName) => {
  logger.info(`${module}: ${functionName} successful`);
});

logEmitter.on("functionFail", (module, functionName, err) => {
  logger.error(`${module}: ${functionName} failed with: ${err.message}`);
});

logEmitter.on("doubleMode", (module, functionName) => {
  logger.info(`${module}: ${functionName}: running in double mode`);
});

module.exports = { logEmitter };
