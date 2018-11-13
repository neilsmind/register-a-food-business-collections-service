const { Router } = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../../openAPI.spec.json");
const {
  getAllRegistrationsByCouncil,
  getUncollectedRegistrationsByCouncil
} = require("../connectors/registrationDb/registrationDb");
const routers = () => {
  const router = Router();
  router.use("/api-docs", swaggerUi.serve);
  router.get("/api-docs", swaggerUi.setup(swaggerDocument));
  router.get("/api/collect/:lc", async (req, res) => {
    const allLocalCouncils = await getAllRegistrationsByCouncil(req.params.lc);
    res.send(allLocalCouncils);
  });
  router.get("/api/collect", async (req, res) => {
    const registrationsToBeCollected = await getUncollectedRegistrationsByCouncil(
      req.params.lc
    );
    res.send(registrationsToBeCollected);
  });
  router.use("/", (req, res) => {
    res.send(swaggerDocument);
  });
  return router;
};

module.exports = { routers };
