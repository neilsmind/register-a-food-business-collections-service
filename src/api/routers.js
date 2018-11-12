const { Router } = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../../openAPI.spec.json");
const {
  getAllRegistrationsByCouncil
} = require("../connectors/registrationDb/registrationDb");
const routers = () => {
  const router = Router();
  router.use("/api-docs", swaggerUi.serve);
  router.get("/api-docs", swaggerUi.setup(swaggerDocument));
  router.get("/api/collect/:lc", async (req, res) => {
    const allLocalCouncils = await getAllRegistrationsByCouncil(req.params.lc);
    res.send(allLocalCouncils);
  });
  router.use("/", (req, res) => {
    res.send(swaggerDocument);
  });
  return router;
};

module.exports = { routers };
