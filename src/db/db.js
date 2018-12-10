const { createLogger } = require("../services/logger");
const db = require("./models");

const logger = createLogger(process.env.LOG_LEVEL);

db.sequelize
  .authenticate()
  .then(() => {
    logger.info("Connection to postgres db has been established successfully.");
  })
  .catch(err => {
    logger.error("Unable to connect to the database:", err);
  });

module.exports = {
  Activities: db.activities,
  Establishment: db.establishment,
  Metadata: db.metadata,
  Operator: db.operator,
  Premise: db.premise,
  Registration: db.registration,
  db
};
