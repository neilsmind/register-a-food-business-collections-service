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
const {
  getCouncilsForSupplier
} = require("../../connectors/configDb/configDb.connector");

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

    /*Check if single requested LA is the same as subscriber. This means it's either an LA requesting 
    their own registrations or a non-LA subscriber not defining which councils they want returned. 
    In the latter case all authorised registrations should be returned by default.*/
    if (
      options.requestedCouncils.length === 1 &&
      options.requestedCouncils[0] === options.subscriber
    ) {
      const validCouncils = await getCouncilsForSupplier(options.subscriber);
      // validCouncils will return empty array if LA subscriber.
      if (validCouncils.length > 0) {
        options.requestedCouncils = validCouncils;
      }
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