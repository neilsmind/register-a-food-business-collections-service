"use strict";
const logger = require("winston");
const { format, transports } = logger;
const { combine, printf, colorize } = format;

logger.add(
  new transports.Console({
    level: "info",
    format: format.combine(format.colorize(), format.json())
  })
);

require("dotenv").config();
const {
  Registration,
  connectToDb,
  closeConnection
} = require("../../src/db/db");

const clearTables = async () => {
  await connectToDb();
  await Registration.truncate({ cascade: true });
  closeConnection();
};

logger.info(`Clearing tables`);
clearTables();
