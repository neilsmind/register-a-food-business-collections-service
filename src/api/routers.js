const { Router } = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerV1Document = require("../../openAPI.spec.json");
const swaggerV2Document = require("../../openAPI-v2.spec.json");
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
  router.get("/api-docs", swaggerUi.setup(swaggerV2Document));
  router.get("/api-docs/v1", swaggerUi.setup(swaggerV1Document));
  router.get("/api-docs/v2", swaggerUi.setup(swaggerV2Document));

  router.use("/", (req, res) => {
    res.send(swaggerV2Document);
  });

  return router;
};

module.exports = { routers };
