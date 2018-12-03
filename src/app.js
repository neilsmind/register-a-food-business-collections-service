const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");

const { createLogger } = require("./services/logger");
const { routers } = require("./api/routers");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
const port = process.env.PORT || 4001;
const logger = createLogger(process.env.LOG_LEVEL);

app.use(helmet());
app.use(bodyParser.json());
app.use("/", routers());
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Collections service started listening on port ${port}`);
});
