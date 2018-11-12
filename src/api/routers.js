const { Router } = require("express");
const {
  getAllRegistrationsByCouncil
} = require("../connectors/registrationDb/registrationDb");
const routers = () => {
  const router = Router();

  router.get("/api/collect/:lc", async (req, res) => {
    const allLocalCouncils = await getAllRegistrationsByCouncil(req.params.lc);
    res.send(allLocalCouncils);
  });

  return router;
};

module.exports = { routers };
