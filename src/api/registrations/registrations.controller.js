const {
  getFullRegistration,
  getAllRegistrationsByCouncil,
  getUnifiedRegistrations,
  updateRegistrationCollectedByCouncil
} = require("../../connectors/registrationDb/registrationsDb.connector");

const { validateOptions } = require("./registrations.service");
const {
  registrationDbDouble
} = require("../../connectors/registrationDb/registrationDb.double");
const {
  transformRegForCollection
} = require("../../services/registrationTransform.service");

const { logEmitter } = require("../../services/logging.service");
const { transformEnums } = require("../../services/v1EnumTransform.service");
const version = 1;

const getRegistrationsByCouncil = async (options) => {
  logEmitter.emit(
    "functionCall",
    "registrations.controller",
    "getRegistrationsByCouncil"
  );

  const validationResult = await validateOptions(options, true);

  if (validationResult === true) {
    if (options.double_mode) {
      return registrationDbDouble(options.double_mode);
    }
    const registrations = await getAllRegistrationsByCouncil(
      options.council,
      options.new,
      options.fields,
      options.before,
      options.after
    );

    const formattedRegistrations = registrations.map((registration) => {
      return transformRegForCollection(registration);
    });
    transformEnums(version, formattedRegistrations);
    logEmitter.emit(
      "functionSuccess",
      "registrations.controller",
      "getRegistrationsByCouncil"
    );
    return formattedRegistrations;
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

  const validationResult = await validateOptions(options);

  if (validationResult === true) {
    if (options.double_mode) {
      return registrationDbDouble(options.double_mode);
    }
    const registration = await getFullRegistration(options.fsa_rn, [
      "establishment",
      "metadata"
    ]);

    const formattedRegistration = transformRegForCollection(registration);
    transformEnums(version, formattedRegistration);
    logEmitter.emit(
      "functionSuccess",
      "registrations.controller",
      "getRegistration"
    );
    return formattedRegistration;
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

    const formattedRegistrations = registrations.map((registration) => {
      return transformRegForCollection(registration);
    });
    transformEnums(version, formattedRegistrations);
    logEmitter.emit(
      "functionSuccess",
      "registrations.controller",
      "getRegistrations"
    );
    return formattedRegistrations;
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

  const validationResult = await validateOptions(options);

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
