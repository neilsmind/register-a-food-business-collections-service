const { Router } = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../../openAPI.spec.json");
const {
  getAllRegistrationsByCouncil,
  getNewRegistrationsByCouncil
} = require("../connectors/registrationDb/registrationDb");
const routers = () => {
  const router = Router();
  router.use("/api-docs", swaggerUi.serve);
  router.get("/api-docs", swaggerUi.setup(swaggerDocument));
  router.get("/api/collect/:lc/all", async (req, res) => {
    const allRegistrations = await getAllRegistrationsByCouncil(req.params.lc);
    res.send(allRegistrations);
  });
  router.get("/api/collect/:lc/new", async (req, res) => {
    const newRegistrations = await getNewRegistrationsByCouncil(req.params.lc);
    res.send(newRegistrations);
  });
  router.use("/", (req, res) => {
    res.send(swaggerDocument);
  });
  return router;
};

module.exports = { routers };
