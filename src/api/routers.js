const { Router } = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../../openAPI.spec.json");
const { registrationsRouter } = require("./registrations/registrations.router");
const {
  registrationsV2Router
} = require("./registrations-v2/registrations.v2.router");

const routers = () => {
  const router = Router();

  router.use("/api/registrations", registrationsRouter());
  router.use("/api/v1/registrations", registrationsRouter());
  router.use("/api/v2/registrations", registrationsV2Router());

  router.use("/api-docs", swaggerUi.serve);
  router.get("/api-docs", swaggerUi.setup(swaggerDocument));

  router.use("/", (req, res) => {
    res.send(swaggerDocument);
  });

  return router;
};

module.exports = { routers };
