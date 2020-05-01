const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");

const logger = require("winston");
const { routers } = require("./api/routers");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
const port = process.env.PORT || 4001;

app.use(helmet());
app.use(bodyParser.json());
app.use("/", routers());
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Collections service started listening on port ${port}`);
});
