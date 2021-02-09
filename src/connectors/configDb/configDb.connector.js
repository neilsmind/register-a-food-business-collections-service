const mongodb = require("mongodb");
const { supplierCollectionDouble } = require("./configDb.double");
const { COSMOSDB_URL } = require("../../config");
const { logEmitter } = require("../../services/logging.service");

let client = undefined;
let configDB = undefined;

const establishConnectionToMongo = async (collectionName) => {
  if (process.env.DOUBLE_MODE === "true") {
    logEmitter.emit(
      "doubleMode",
      "configDb.connector",
      "establishConnectionToMongo"
    );
    return supplierCollectionDouble;
  } else {
    logEmitter.emit(
      "functionCall",
      "configDb.connector",
      "establishConnectionToMongo"
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
          "configDb.connector",
          "establishConnectionToMongo",
          err
        );
        throw err;
      }
    }

    configDB = client.db("config");
    let collection = configDB.collection(collectionName);
    logEmitter.emit(
      "functionSuccess",
      "configDb.connector",
      "establishConnectionToMongo"
    );
    return collection;
  }
};

const clearMongoConnection = () => {
  client = undefined;
  configDB = undefined;
};

const getCouncilsForSupplier = async (url) => {
  logEmitter.emit(
    "functionCall",
    "configDb.connector",
    "getCouncilsForSupplier"
  );

  let councils = [];

  try {
    const supplierConfigCollection = await establishConnectionToMongo(
      "suppliers"
    );
    const supplierConfig = await supplierConfigCollection.findOne({
      supplier_url: url
    });
    councils = supplierConfig ? supplierConfig.local_council_urls : [];
  } catch (err) {
    logEmitter.emit(
      "functionFail",
      "configDb.connector",
      "getCouncilsForSupplier",
      err
    );

    const newError = new Error();
    newError.name = "mongoConnectionError";
    newError.message = err.message;

    throw newError;
  }

  logEmitter.emit(
    "functionSuccess",
    "configDb.connector",
    "getCouncilsForSupplier"
  );

  return councils;
};

module.exports = {
  mongodb,
  establishConnectionToMongo,
  clearMongoConnection,
  getCouncilsForSupplier
};
