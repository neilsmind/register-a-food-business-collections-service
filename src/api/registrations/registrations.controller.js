const {
  getUnifiedRegistrations,
  getAllRegistrationsByCouncil,
  getSingleRegistration,
  updateRegistrationCollectedByCouncil
} = require("../../connectors/registrationDb/registrationDb.connector");

const { validateOptions } = require("./registrations.service");

const {
  registrationDbDouble
} = require("../../connectors/registrationDb/registrationDb.double");

const { logEmitter } = require("../../services/logging.service");

const { transformEnums } = require("../../services/transform.service");

const getRegistrationsByCouncil = async (options) => {
  logEmitter.emit(
    "functionCall",
    "registrations.controller",
    "getRegistrationsByCouncil"
  );

  const validationResult = validateOptions(options, true);

  if (validationResult === true) {
    if (options.double_mode) {
      return registrationDbDouble(options.double_mode);
    }
    let registrations = await getAllRegistrationsByCouncil(
      options.council,
      options.new,
      options.fields,
      options.before,
      options.after
    );
    transformEnums(options.version, registrations);
    logEmitter.emit(
      "functionSuccess",
      "registrations.controller",
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
    "registrations.controller",
    "getRegistration"
  );

  const validationResult = validateOptions(options);

  if (validationResult === true) {
    if (options.double_mode) {
      return registrationDbDouble(options.double_mode);
    }
    let registration = await getSingleRegistration(
      options.fsa_rn,
      options.council
    );
    transformEnums(options.version, registration);
    logEmitter.emit(
      "functionSuccess",
      "registrations.controller",
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
    "registrations.controller",
    "getRegistrations"
  );

  const validationResult = validateOptions(options);

  if (validationResult === true) {
    if (options.double_mode) {
      return registrationDbDouble(options.double_mode);
    }

    let registrations = await getUnifiedRegistrations(
      options.before,
      options.after,
      ["establishment", "metadata"]
    );
    transformEnums(options.version, registrations);
    logEmitter.emit(
      "functionSuccess",
      "registrations.controller",
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
    "registrations.controller",
    "updateRegistration"
  );

  const validationResult = validateOptions(options);

  if (validationResult === true) {
    if (options.double_mode) {
      return registrationDbDouble(options.double_mode);
    }

    const response = await updateRegistrationCollectedByCouncil(
      options.fsa_rn,
      options.collected,
      options.council
    );

    logEmitter.emit(
      "functionSuccess",
      "registrations.controller",
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
