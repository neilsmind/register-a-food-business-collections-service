const express = require("express");
const helmet = require("helmet");

const { logger } = require("./services/logging.service");
const { routers } = require("./api/routers");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
const port = process.env.PORT || 4001;

app.use(helmet());
app.use("/", routers());
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Collections service started listening on port ${port}`);
});
