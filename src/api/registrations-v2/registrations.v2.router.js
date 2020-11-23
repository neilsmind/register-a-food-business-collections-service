const { Router } = require("express");
const { logEmitter } = require("../../services/logging.service");
const {
  getRegistrationsByCouncil,
  getRegistration,
  getRegistrations,
  updateRegistration
} = require("./registrations.v2.controller");

const registrationsV2Router = () => {
  const router = Router();

  router.get("/unified", async (req, res, next) => {
    logEmitter.emit(
      "functionCall",
      "registrations.router",
      "GET /unified route"
    );
    try {
      let registrations;
      const options = {
        double_mode: req.headers["double-mode"] || "",
        after: req.query.after,
        before: req.query.before
      };

      registrations = await getRegistrations(options);

      logEmitter.emit(
        "functionSuccess",
        "registrations.router",
        "GET /unified route"
      );
      res.send(registrations);
    } catch (err) {
      logEmitter.emit(
        "functionFail",
        "registrations.router",
        "GET /unified route",
        err
      );
      next(err);
    }
  });

  router.get("/:lc", async (req, res, next) => {
    logEmitter.emit("functionCall", "registrations.router", "/:lc route");
    try {
      let registrations;
      const fields = req.query.fields ? req.query.fields.split(",") : [];
      const options = {
        double_mode: req.headers["double-mode"] || "",
        new: req.query.new || "true",
        fields,
        requester: req.params.lc,
        after: req.query.after || "2000-01-01",
        before: req.query.before || new Date(Date.now()).toISOString(),
        requestedCouncils: req.query["local-authorities"]
          ? req.query["local-authorities"].split(",")
          : [req.params.lc]
      };

      registrations = await getRegistrationsByCouncil(options);

      logEmitter.emit(
        "functionSuccess",
        "registrations.router",
        "GET /:lc route"
      );
      res.send(registrations);
    } catch (err) {
      logEmitter.emit(
        "functionFail",
        "registrations.router",
        "GET /:lc route",
        err
      );
      next(err);
    }
  });

  router.get("/:lc/:fsa_rn", async (req, res, next) => {
    logEmitter.emit(
      "functionCall",
      "registrations.router",
      "GET /:lc/:fsa_rn route"
    );
    try {
      const options = {
        double_mode: req.headers["double-mode"] || "",
        fsa_rn: req.params.fsa_rn,
        requester: req.params.lc,
        requestedCouncil: req.query["local-authority"] || req.params.lc
      };

      const registration = await getRegistration(options);

      logEmitter.emit(
        "functionSuccess",
        "registrations.router",
        "GET /:lc/:fsa_rn route"
      );
      res.send(registration);
    } catch (err) {
      logEmitter.emit(
        "functionFail",
        "registrations.router",
        "GET /:lc/:fsa_rn route",
        err
      );
      next(err);
    }
  });

  router.put("/:lc/:fsa_rn", async (req, res, next) => {
    logEmitter.emit(
      "functionCall",
      "registrations.router",
      "PUT /:lc/:fsa_rn route"
    );
    try {
      const options = {
        double_mode: req.headers["double-mode"] || "",
        collected: req.body.collected,
        fsa_rn: req.params.fsa_rn,
        requester: req.params.lc,
        requestedCouncil: req.query["local-authority"] || req.params.lc
      };

      const response = await updateRegistration(options);

      logEmitter.emit(
        "functionSuccess",
        "registrations.router",
        "PUT /:lc/:fsa_rn route"
      );
      res.send(response);
    } catch (err) {
      logEmitter.emit(
        "functionFail",
        "registrations.router",
        "PUT /:lc/:fsa_rn route",
        err
      );
      next(err);
    }
  });

  return router;
};

module.exports = { registrationsV2Router };
