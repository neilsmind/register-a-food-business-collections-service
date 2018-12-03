const {
  Activities,
  Establishment,
  Metadata,
  Operator,
  Premise,
  Registration
} = require("../../db/db");
const { logEmitter } = require("../../services/logging.service");

const modelFindOne = async (query, model) => {
  try {
    return model.findOne(query);
  } catch (err) {
    err.name = "dbModelFindOneError";
    err.rawError = `Model: ${model}`;
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

const getRegistrationTable = async (council, collected) => {
  logEmitter.emit(
    "functionCall",
    "registration.connector.js",
    "getRegistrationTableByCouncil"
  );
  try {
    const response = await Registration.findAll({
      where: {
        council,
        collected
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

const getAllRegistrations = async (council, collected) => {
  const registrationPromises = [];
  const queryArray = collected ? [true, false, null] : [false, null];
  const registrations = await getRegistrationTable(council, queryArray);

  registrations.forEach(registration => {
    registrationPromises.push(getFullRegistration(registration));
  });
  const fullRegistrations = await Promise.all(registrationPromises);

  return fullRegistrations;
};

const updateRegistrationCollected = async (fsa_rn, collected) => {
  const isoDate = convertJSDateToISODate();
  Registration.update(
    {
      collected,
      collected_at: isoDate
    },
    {
      where: {
        fsa_rn
      }
    }
  );

  return { fsa_rn, collected };
};

module.exports = {
  getAllRegistrations,
  updateRegistrationCollected
};
