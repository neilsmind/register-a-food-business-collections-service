const {
  getAllRegistrations,
  updateRegistrationCollected
} = require("../../connectors/registrationDb/registrationDb.connector");

const {
  registrationDbDouble
} = require("../../connectors/registrationDb/registrationDb.double");

const { logEmitter } = require("../../services/logging.service");

const validateBoolean = value => {
  return typeof value === "boolean";
};

const validateBooleanString = value => {
  const validValues = ["true", "false"];
  return validValues.includes(value);
};

const getRegistrations = async options => {
  logEmitter.emit(
    "functionCall",
    "registrations.controller",
    "getRegistrations"
  );

  if (validateBooleanString(options.getNewRegistrations)) {
    if (options.double_mode) {
      return registrationDbDouble(options.double_mode);
    }
    const registrations = await getAllRegistrations(
      options.council,
      options.collected
    );
    logEmitter.emit(
      "functionSuccess",
      "registrations.controller",
      "getRegistrations"
    );
    return registrations;
  } else {
    const error = new Error("getNewRegistrations invalid");
    error.name = "getNewRegistrationsError";
    throw error;
  }
};

const updateRegistration = async options => {
  logEmitter.emit(
    "functionCall",
    "registrations.controller",
    "updateRegistration"
  );

  if (validateBoolean(options.collected)) {
    if (options.double_mode) {
      return registrationDbDouble(options.double_mode);
    }

    const response = await updateRegistrationCollected(
      options.fsa_rn,
      options.collected
    );

    logEmitter.emit(
      "functionSuccess",
      "registrations.controller",
      "updateRegistration"
    );

    return response;
  } else {
    const error = new Error("collected invalid");
    error.name = "updateCollectedError";
    throw error;
  }
};

module.exports = { getRegistrations, updateRegistration };
