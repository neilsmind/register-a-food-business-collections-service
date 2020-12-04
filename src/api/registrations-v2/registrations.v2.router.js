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
      "registrations.v2.router",
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
        "registrations.v2.router",
        "GET /unified route"
      );
      res.send(registrations);
    } catch (err) {
      logEmitter.emit(
        "functionFail",
        "registrations.v2.router",
        "GET /unified route",
        err
      );
      next(err);
    }
  });

  router.get("/:subscriber", async (req, res, next) => {
    logEmitter.emit(
      "functionCall",
      "registrations.v2.router",
      "/:subscriber route"
    );
    try {
      let registrations;
      const fields = req.query.fields ? req.query.fields.split(",") : [];
      const options = {
        double_mode: req.headers["double-mode"] || "",
        new: req.query.new || "true",
        fields,
        subscriber: req.params.subscriber,
        after: req.query.after || "2000-01-01",
        before: req.query.before || new Date(Date.now()).toISOString(),
        requestedCouncils: req.query["local-authorities"]
          ? req.query["local-authorities"].split(",")
          : [req.params.subscriber]
      };

      registrations = await getRegistrationsByCouncil(options);

      logEmitter.emit(
        "functionSuccess",
        "registrations.v2.router",
        "GET /:subscriber route"
      );
      res.send(registrations);
    } catch (err) {
      logEmitter.emit(
        "functionFail",
        "registrations.v2.router",
        "GET /:subscriber route",
        err
      );
      next(err);
    }
  });

  router.get("/:subscriber/:fsa_rn", async (req, res, next) => {
    logEmitter.emit(
      "functionCall",
      "registrations.v2.router",
      "GET /:subscriber/:fsa_rn route"
    );
    try {
      const options = {
        double_mode: req.headers["double-mode"] || "",
        fsa_rn: req.params.fsa_rn,
        subscriber: req.params.subscriber,
        requestedCouncil: req.query["local-authority"] || req.params.subscriber
      };

      const registration = await getRegistration(options);

      logEmitter.emit(
        "functionSuccess",
        "registrations.v2.router",
        "GET /:subscriber/:fsa_rn route"
      );
      res.send(registration);
    } catch (err) {
      logEmitter.emit(
        "functionFail",
        "registrations.v2.router",
        "GET /:subscriber/:fsa_rn route",
        err
      );
      next(err);
    }
  });

  router.put("/:subscriber/:fsa_rn", async (req, res, next) => {
    logEmitter.emit(
      "functionCall",
      "registrations.v2.router",
      "PUT /:subscriber/:fsa_rn route"
    );
    try {
      const options = {
        double_mode: req.headers["double-mode"] || "",
        collected: req.body.collected,
        fsa_rn: req.params.fsa_rn,
        subscriber: req.params.subscriber,
        requestedCouncil: req.query["local-authority"] || req.params.subscriber
      };

      const response = await updateRegistration(options);

      logEmitter.emit(
        "functionSuccess",
        "registrations.v2.router",
        "PUT /:subscriber/:fsa_rn route"
      );
      res.send(response);
    } catch (err) {
      logEmitter.emit(
        "functionFail",
        "registrations.v2.router",
        "PUT /:subscriber/:fsa_rn route",
        err
      );
      next(err);
    }
  });

  return router;
};

module.exports = { registrationsV2Router };
