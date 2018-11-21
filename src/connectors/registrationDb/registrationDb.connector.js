const {
  Activities,
  Establishment,
  Metadata,
  Operator,
  Premise,
  Registration
} = require("../../db/db");
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

const convertJSDateToISODate = () => {
  const jsDate = new Date();
  const isoDate = jsDate.toISOString();
  return isoDate;
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

const getRegistrationTableByCouncil = async council => {
  logEmitter.emit(
    "functionCall",
    "registration.connector.js",
    "getRegistrationTableByCouncil"
  );
  try {
    const response = await Registration.findAll({
      where: {
        council: council
      },
      attributes: { exclude: ["collected", "collected_at"] }
    });
    logEmitter.emit(
      "functionSuccess",
      "registration.connector.js",
      "getRegistrationTableByCouncil"
    );
    return response;
  } catch (err) {
    logEmitter.emit(
      "functionFail",
      "registration.connector.js",
      "getRegistrationTableByCouncil",
      err
    );
    throw err;
  }
};

const getRegistrationTableByCouncilAndNew = async council => {
  logEmitter.emit(
    "functionCall",
    "registration.connector.js",
    "getRegistrationTableByCouncilAndNew"
  );
  try {
    const response = await Registration.findAll({
      where: {
        council: council,
        collected: null
      },
      attributes: { exclude: ["collected", "collected_at"] }
    });

    logEmitter.emit(
      "functionSuccess",
      "registration.connector.js",
      "getRegistrationTableByCouncilAndNew"
    );
    return response;
  } catch (err) {
    logEmitter.emit(
      "functionFail",
      "registration.connector.js",
      "getRegistrationTableByCouncilAndNew",
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

const updateRegistrationCollectedToTrue = async council => {
  const isoDate = convertJSDateToISODate();
  Registration.update(
    {
      collected: true,
      collected_at: isoDate
    },
    {
      where: {
        council: council,
        collected: null
      }
    }
  );
};

module.exports = {
  getRegistrationTableByCouncil,
  getRegistrationTableByCouncilAndNew,
  getFullRegistration,
  updateRegistrationCollectedToTrue
};
