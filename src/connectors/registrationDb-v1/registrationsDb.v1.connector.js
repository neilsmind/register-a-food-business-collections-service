const mongodb = require("mongodb");
const { COSMOSDB_URL } = require("../../config");
const { logEmitter } = require("../../services/logging.service");

let client = undefined;
let registrationsDB = undefined;

const establishConnectionToRegistrations = async () => {
  logEmitter.emit(
    "functionCall",
    "registrationDb.v2.connector",
    "establishConnectionToRegistrations"
  );

  // If no connection or connection is not valid after downtime
  if (!client || !client.topology || !client.topology.isConnected()) {
    try {
      if (client && client.topology !== undefined) {
        client.close();
      }
      client = await mongodb.MongoClient.connect(COSMOSDB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    } catch (err) {
      logEmitter.emit(
        "functionFail",
        "registrationDb.v2.connector",
        "establishConnectionToRegistrations",
        err
      );
      throw err;
    }
  }

  registrationsDB = client.db("registrations");
  let collection = registrationsDB.collection("registrations");
  logEmitter.emit(
    "functionSuccess",
    "registrationDb.v2.connector",
    "establishConnectionToRegistrations"
  );
  return collection;
};

const getRegistrationsByCouncil = async (council, collected, before, after) => {
  logEmitter.emit(
    "functionCall",
    "registrationsDb.v1.connector",
    "getRegistrationsByCouncil"
  );
  try {
    const registrationsCollection = await establishConnectionToRegistrations();
    const registrations = await registrationsCollection
      .find({
        $and: [
          { local_council_url: council },
          { collected: { $in: collected } },
          { createdAt: { $gte: new Date(after) } },
          { createdAt: { $lte: new Date(before) } }
        ]
      })
      .project({ _id: 0, "fsa-rn": 1 })
      .toArray();

    logEmitter.emit(
      "functionSuccess",
      "registrationsDb.v1.connector",
      "getRegistrationsByCouncil"
    );
    return registrations;
  } catch (err) {
    logEmitter.emit(
      "functionFail",
      "registrationsDb.v1.connector",
      "getRegistrationsByCouncil",
      err
    );
    throw err;
  }
};

const getAllRegistrations = async (before, after) => {
  logEmitter.emit(
    "functionCall",
    "registrationsDb.v1.connector",
    "getRegistrationTable"
  );
  try {
    let registrationsCollection = await establishConnectionToRegistrations();

    const registrations = await registrationsCollection
      .find({
        $and: [{ createdAt: { $gte: after } }, { createdAt: { $lte: before } }]
      })
      .project({ _id: 0, "fsa-rn": 1 })
      .toArray();
    logEmitter.emit(
      "functionSuccess",
      "registrationsDb.v1.connector",
      "getRegistrationTable"
    );
    return registrations;
  } catch (err) {
    logEmitter.emit(
      "functionFail",
      "registrationsDb.v1.connector",
      "getRegistrationTable",
      err
    );
    throw err;
  }
};

const getFullRegistration = async (fsa_rn, fields = []) => {
  logEmitter.emit(
    "functionCall",
    "registrationsDb.v1.connector",
    "getFullRegistration"
  );

  const projection = Object.assign(
    {
      _id: 0,
      "fsa-rn": 1,
      collected: 1,
      collected_at: 1,
      createdAt: 1,
      updatedAt: 1
    },
    fields.includes("establishment") ? { establishment: 1 } : {},
    fields.includes("metadata") ? { metadata: 1 } : {},
    {
      "hygiene.local_council": 1,
      "hygieneAndStandards.local_council": 1,
      local_council_url: 1,
      source_council_id: 1
    }
  );

  let registrationsCollection = await establishConnectionToRegistrations();

  const registration = await registrationsCollection
    .find({
      "fsa-rn": fsa_rn
    })
    .project(projection)
    .toArray(); // toArray needed to transform from mongo db cursor

  if (registration === null) {
    const error = new Error("getRegistrationNotFoundError");
    error.name = "getRegistrationNotFoundError";
    logEmitter.emit(
      "functionFail",
      "registrationsDb.v1.connector",
      "getRegistrationCollected",
      error
    );
    throw error;
  }
  logEmitter.emit(
    "functionSuccess",
    "registrationsDb.v1.connector",
    "getFullRegistration"
  );

  // Extract registration object from the array
  return registration[0];
};

const getUnifiedRegistrations = async (
  before,
  after,
  fields = ["establishment", "metadata"]
) => {
  logEmitter.emit(
    "functionCall",
    "registrationsDb.v1.connector",
    "getUnifiedRegistrations"
  );

  // convert ISOStrings to Date type
  const beforeDate = new Date(before);
  const afterDate = new Date(after);

  const registrations = await getAllRegistrations(beforeDate, afterDate);

  const fullRegistrations = await Promise.all(
    registrations.map(async (registration) => {
      return getFullRegistration(registration["fsa-rn"], fields);
    })
  );

  logEmitter.emit(
    "functionSuccess",
    "registrationsDb.v1.connector",
    "getUnifiedRegistrations"
  );
  return fullRegistrations;
};

const getAllRegistrationsByCouncil = async (
  council,
  newRegistrations,
  fields,
  before,
  after
) => {
  logEmitter.emit(
    "functionCall",
    "registrationsDb.v1.connector",
    "getAllRegistrationsByCouncil"
  );

  // get NEW [false, null] or EVERYTHING [true, false, null]
  const queryArray = newRegistrations === "true" ? [false] : [true, false];
  const registrations = await getRegistrationsByCouncil(
    council,
    queryArray,
    before,
    after
  );

  const fullRegistrations = await Promise.all(
    registrations.map(async (registration) => {
      return getFullRegistration(registration["fsa-rn"], fields);
    })
  );
  logEmitter.emit(
    "functionSuccess",
    "registrationsDb.v1.connector",
    "getAllRegistrationsByCouncil"
  );
  return fullRegistrations;
};

const updateRegistrationCollectedByCouncil = async (
  fsa_rn,
  collected,
  council
) => {
  logEmitter.emit(
    "functionCall",
    "registrationsDb.v1.connector",
    "updateRegistrationCollectedByCouncil"
  );

  let registrationsCollection = await establishConnectionToRegistrations();

  const response = await registrationsCollection.updateOne(
    {
      "fsa-rn": fsa_rn,
      local_council_url: council
    },
    {
      $set: {
        collected: collected,
        collected_at: new Date(),
        updatedAt: new Date()
      }
    }
  );
  if (response.result.n === 0) {
    const error = new Error("updateRegistrationNotFoundError");
    error.name = "updateRegistrationNotFoundError";
    logEmitter.emit(
      "functionFail",
      "registrationsDb.v1.connector",
      "updateRegistrationCollectedByCouncil",
      error
    );
    throw error;
  }
  logEmitter.emit(
    "functionSuccess",
    "registrationsDb.v1.connector",
    "updateRegistrationCollectedByCouncil"
  );
  return { fsa_rn, collected };
};

module.exports = {
  getUnifiedRegistrations,
  getAllRegistrationsByCouncil,
  getFullRegistration,
  updateRegistrationCollectedByCouncil
};
