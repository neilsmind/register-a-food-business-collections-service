const EventEmitter = require("events");
const { createLogger } = require("./logger");

class LogEmitter extends EventEmitter {}

const logEmitter = new LogEmitter();

const logger = createLogger(process.env.LOG_LEVEL);

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
