const { createLogger } = require("../../services/logger");
const logger = createLogger(process.env.LOG_LEVEL);

module.exports = {
  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASS,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    dialect: "postgres",
    logging: logger.debug,
    dialectOptions: {
      ssl: true
    }
  },
  development: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASS,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    dialect: "postgres",
    logging: logger.debug,
    dialectOptions: {
      ssl: true
    }
  },
  local: {
    username: "postgres",
    password: process.env.POSTGRES_PASS,
    database: "postgres",
    host: "temp-store",
    dialect: "postgres",
    logging: logger.debug
  }
};
