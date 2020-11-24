const {
  getUnifiedRegistrations,
  getAllRegistrationsByCouncils,
  getSingleRegistration,
  updateRegistrationCollectedByCouncil
} = require("../../connectors/registrationDb-v2/registrationDb.v2.connector");

const { validateOptions } = require("./registrations.v2.service");

const {
  registrationDbDouble
} = require("../../connectors/registrationDb-v2/registrationDb.v2.double");

const { logEmitter } = require("../../services/logging.service");

const getRegistrationsByCouncil = async (options) => {
  logEmitter.emit(
    "functionCall",
    "registrations.v2.controller",
    "getRegistrationsByCouncil"
  );

  const validationResult = await validateOptions(options, true);

  if (validationResult === true) {
    if (options.double_mode) {
      return registrationDbDouble(options.double_mode);
    }
    const registrations = await getAllRegistrationsByCouncils(
      options.requestedCouncils,
      options.new,
      options.fields,
      options.before,
      options.after
    );
    logEmitter.emit(
      "functionSuccess",
      "registrations.v2.controller",
      "getRegistrationsByCouncil"
    );
    return registrations;
  } else {
    const error = new Error("");
    error.name = "optionsValidationError";
    error.rawError = validationResult;
    throw error;
  }
};

const getRegistration = async (options) => {
  logEmitter.emit(
    "functionCall",
    "registrations.v2.controller",
    "getRegistration"
  );

  const validationResult = await validateOptions(options);

  if (validationResult === true) {
    if (options.double_mode) {
      return registrationDbDouble(options.double_mode);
    }
    const registration = await getSingleRegistration(
      options.fsa_rn,
      options.requestedCouncil
    );
    logEmitter.emit(
      "functionSuccess",
      "registrations.v2.controller",
      "getRegistration"
    );
    return registration;
  } else {
    const error = new Error("");
    error.name = "optionsValidationError";
    error.rawError = validationResult;
    throw error;
  }
};

const getRegistrations = async (options) => {
  logEmitter.emit(
    "functionCall",
    "registrations.v2.controller",
    "getRegistrations"
  );

  const validationResult = await validateOptions(options);

  if (validationResult === true) {
    if (options.double_mode) {
      return registrationDbDouble(options.double_mode);
    }

    const registrations = await getUnifiedRegistrations(
      options.before,
      options.after,
      ["establishment", "metadata"]
    );
    logEmitter.emit(
      "functionSuccess",
      "registrations.v2.controller",
      "getRegistrations"
    );
    return registrations;
  } else {
    const error = new Error("");
    error.name = "optionsValidationError";
    error.rawError = validationResult;
    throw error;
  }
};

const updateRegistration = async (options) => {
  logEmitter.emit(
    "functionCall",
    "registrations.v2.controller",
    "updateRegistration"
  );

  const validationResult = await validateOptions(options);

  if (validationResult === true) {
    if (options.double_mode) {
      return registrationDbDouble(options.double_mode);
    }

    const response = await updateRegistrationCollectedByCouncil(
      options.fsa_rn,
      options.collected,
      options.requestedCouncil
    );

    logEmitter.emit(
      "functionSuccess",
      "registrations.v2.controller",
      "updateRegistration"
    );

    return response;
  } else {
    const error = new Error("");
    error.name = "optionsValidationError";
    error.rawError = validationResult;
    throw error;
  }
};

module.exports = {
  getRegistrations,
  getRegistrationsByCouncil,
  getRegistration,
  updateRegistration
};
