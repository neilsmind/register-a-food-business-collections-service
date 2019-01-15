const request = require("request-promise-native");
const argv = require("yargs").argv;
const flatten = require("lodash.flatten");
const {
  Activities,
  Establishment,
  Metadata,
  Operator,
  Premise,
  Registration,
  connectToDb,
  closeConnection
} = require("../src/db/db");
const { createLogger } = require("../src/services/logger");

const logger = createLogger("info");

const modelCreate = async (data, model) => {
  const response = await model.create(data);
  return response;
};

const createActivities = async (activities, establishmentId) => {
  const data = Object.assign({}, activities, { establishmentId });
  return modelCreate(data, Activities, "Activities");
};

const createEstablishment = async (establishment, registrationId) => {
  const data = Object.assign({}, establishment, { registrationId });
  return modelCreate(data, Establishment, "Establishment");
};

const createMetadata = async (metadata, registrationId) => {
  const data = Object.assign({}, metadata, { registrationId });
  return modelCreate(data, Metadata, "Metadata");
};

const createOperator = async (operator, establishmentId) => {
  const data = Object.assign({}, operator, { establishmentId });
  return modelCreate(data, Operator, "Operator");
};

const createPremise = async (premise, establishmentId) => {
  const data = Object.assign({}, premise, { establishmentId });
  return modelCreate(data, Premise, "Premise");
};

const createRegistration = async (fsa_rn, council) => {
  const data = { fsa_rn, council };
  return modelCreate(data, Registration, "Registration");
};

const saveRegistration = async (registration, fsa_rn, council) => {
  logger.info(`saveRegistration called with: ${fsa_rn} `);
  const reg = await createRegistration(fsa_rn, council);
  const establishment = await createEstablishment(
    registration.establishment.establishment_details,
    reg.id
  );
  const operator = await createOperator(
    registration.establishment.operator,
    establishment.id
  );
  const activities = await createActivities(
    registration.establishment.activities,
    establishment.id
  );
  const premise = await createPremise(
    registration.establishment.premise,
    establishment.id
  );
  const metadata = await createMetadata(registration.metadata, reg.id);
  return {
    regId: reg.id,
    establishmentId: establishment.id,
    operatorId: operator.id,
    activitiesId: activities.id,
    premiseId: premise.id,
    metadataId: metadata.id
  };
};

const getTestData = async (type, council, count) => {
  const requestOptions = {
    uri: `https://my.api.mockaroo.com/${type}/${council}/${count}.json?key=${
      process.env.MOCKAROO_KEY
    }`,
    method: "GET",
    json: true
  };

  return request(requestOptions);
};
const getAllData = async (count, council) => {
  // Mix up sole trader, partnership, company, charity
  const dataTypes = [
    "soleTrader",
    "partnership",
    "repPerson",
    "repCompany",
    "repCharity"
  ];
  const splitTotal = [];

  // Split total number of records into 5 numbers to create distribution of data types
  while (count > 0) {
    var s = Math.round(Math.random() * count);
    splitTotal.push(s);
    count -= s;
    if (splitTotal.length === 4) {
      splitTotal.push(count);
      count = 0;
    }
  }

  while (splitTotal.length < dataTypes.length) {
    splitTotal.push(0);
  }

  const dataPromises = [];

  // Get test data for council
  dataTypes.forEach((type, index) => {
    dataPromises.push(getTestData(type, council, splitTotal[index]));
  });

  const data = await Promise.all(dataPromises);
  return flatten(data);
};

const getFsaRn = async () => {
  const requestOptions = {
    uri: `https://fsa-reference-numbers.epimorphics.net/generate/9999/000`,
    method: "GET",
    json: true
  };
  const fsaRnResponse = await request(requestOptions);
  return fsaRnResponse["fsa-rn"];
};

const getFsaRnAndSaveData = async record => {
  const fsa_rn = await getFsaRn();
  return saveRegistration(
    record.registration,
    fsa_rn,
    record.local_council_url
  );
};

const run = async () => {
  await connectToDb();
  const data = await getAllData(argv.count, argv.council);
  const promises = [];
  data.forEach(async record => {
    promises.push(getFsaRnAndSaveData(record));
  });
  await Promise.all(promises);
  closeConnection();
};

run();
