"use strict";
const { logEmitter, INFO } = require("../../src/services/logging.service");

logEmitter.emit(INFO, `Seeding tables`);

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

logEmitter.emit(INFO, `Clearing tables`);
clearTables();
