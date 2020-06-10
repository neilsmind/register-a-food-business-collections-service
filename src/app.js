const appInsights = require('applicationinsights');

if ('APPINSIGHTS_INSTRUMENTATIONKEY' in process.env && process.env['APPINSIGHTS_INSTRUMENTATIONKEY'] !== "") {
    console.log(`Setting up application insights modules`)
    appInsights.setup().start();
}

const { logger } = require("./services/winston");
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");

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
