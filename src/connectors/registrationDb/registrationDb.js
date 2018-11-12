const {
  Activities,
  Establishment,
  Metadata,
  Operator,
  Premise,
  Registration
} = require("../../db/db");
const allRegistrationsDouble = require("./registrationDb.double");
const { logEmitter } = require("../../services/logging.service");

const modelFindOne = async (query, model, functionName) => {
  logEmitter.emit("functionCall", "registration.connector.js", functionName);
  try {
    const response = await model.findOne(query);
    logEmitter.emit(
      "functionSuccess",
      "registration.connector.js",
      functionName
    );
    return response;
  } catch (err) {
    err.name = "dbModelFindOneError";
    err.rawError = `Model: ${model}`;
    logEmitter.emit(
      "functionFail",
      "registration.connector.js",
      functionName,
      err
    );
    throw err;
  }
};

const getEstablishmentByRegId = async id => {
  return modelFindOne(
    { where: { registrationId: id } },
    Establishment,
    "getEstablishmentByRegId"
  );
};

const getMetadataByRegId = async id => {
  return modelFindOne(
    { where: { registrationId: id } },
    Metadata,
    "getMetadataByRegId"
  );
};

const getOperatorByEstablishmentId = async id => {
  return modelFindOne(
    { where: { establishmentId: id } },
    Operator,
    "getOperatorByEstablishmentId"
  );
};

const getPremiseByEstablishmentId = async id => {
  return modelFindOne(
    { where: { establishmentId: id } },
    Premise,
    "getPremiseByEstablishmentId"
  );
};

const getActivitiesByEstablishmentId = async id => {
  return modelFindOne(
    { where: { establishmentId: id } },
    Activities,
    "getActivitiesByEstablishmentId"
  );
};

const getRegistrationsByCouncil = async council => {
  logEmitter.emit(
    "functionCall",
    "registration.connector.js",
    "getRegistrationsByCouncil"
  );
  try {
    const response = await Registration.findAll({
      where: {
        council: council
      }
    });
    logEmitter.emit(
      "functionSuccess",
      "registration.connector.js",
      "getRegistrationsByCouncil"
    );
    return response;
  } catch (err) {
    logEmitter.emit(
      "functionFail",
      "registration.connector.js",
      "getRegistrationsByCouncil",
      err
    );
    throw err;
  }
};

const getFullRegistration = async registration => {
  const [establishment, metadata] = await Promise.all([
    getEstablishmentByRegId(registration.id),
    getMetadataByRegId(registration.id)
  ]);
  const [operator, activities, premise] = await Promise.all([
    getOperatorByEstablishmentId(establishment.id),
    getActivitiesByEstablishmentId(establishment.id),
    getPremiseByEstablishmentId(establishment.id)
  ]);
  return {
    registration: registration.dataValues,
    establishment: establishment.dataValues,
    operator: operator.dataValues,
    activities: activities.dataValues,
    premise: premise.dataValues,
    metadata: metadata.dataValues
  };
};

const getAllRegistrationsByCouncil = async council => {
  if (process.env.DOUBLE_MODE === "true") {
    return allRegistrationsDouble;
  }
  const registrationPromises = [];
  const registrations = await getRegistrationsByCouncil(council);
  registrations.forEach(registration => {
    registrationPromises.push(getFullRegistration(registration));
  });
  const fullRegistrations = await Promise.all(registrationPromises);

  return fullRegistrations;
};

module.exports = {
  getEstablishmentByRegId,
  getMetadataByRegId,
  getOperatorByEstablishmentId,
  getPremiseByEstablishmentId,
  getActivitiesByEstablishmentId,
  getRegistrationsByCouncil,
  getAllRegistrationsByCouncil
};
