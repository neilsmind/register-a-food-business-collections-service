const { logger } = require("../services/logger");
const db = require("./models");

db.sequelize
  .authenticate()
  .then(() => {
    logger.info("Connection to postgres db has been established successfully.");
  })
  .catch(err => {
    logger.info("Unable to connect to the database:", err);
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
