const { Router } = require("express");
const { logEmitter } = require("../../services/logging.service");
const {
  getAllRegistrationsByCouncil,
  getNewRegistrationsByCouncil
} = require("./collect.service");

const collectRouter = () => {
  const router = Router();

  router.get("/:lc/all", async (req, res, next) => {
    logEmitter.emit("functionCall", "collect.router", "/:lc/all route");
    try {
      const options = {};
      options.double_mode = req.headers["double-mode"];
      options.mark_as_collected = req.query.mark_as_collected;

      const allRegistrations = await getAllRegistrationsByCouncil(
        req.params.lc,
        options
      );
      logEmitter.emit("functionSuccess", "collect.router", "/:lc/all route");
      res.send(allRegistrations);
    } catch (err) {
      logEmitter.emit("functionFail", "collect.router", "/:lc/all route", err);
      next(err);
    }
  });

  router.get("/:lc/new", async (req, res, next) => {
    logEmitter.emit("functionCall", "collect.router", "/:lc/new route");
    try {
      const options = {};
      options.double_mode = req.headers["double-mode"];

      const newRegistrations = await getNewRegistrationsByCouncil(
        req.params.lc,
        options
      );

      logEmitter.emit("functionSuccess", "collect.router", "/:lc/new route");
      res.send(newRegistrations);
    } catch (err) {
      logEmitter.emit("functionFail", "collect.router", "/:lc/new route", err);
      next(err);
    }
  });

  return router;
};

module.exports = { collectRouter };
