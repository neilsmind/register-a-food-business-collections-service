const mongodb = require("mongodb");
const { COSMOSDB_URL } = require("../config");
const { logEmitter } = require("../services/logging.service");
const { supplierConnectionDouble } = require("./configDb/configDb.double");

let client = undefined;
let DB;

const establishConnectionToCosmos = async (dbName, collectionName) => {
  if (process.env.DOUBLE_MODE === "true") {
    logEmitter.emit(
      "doubleMode",
      "cosmos.client.js",
      "establishConnectionToCosmos"
    );
    return dbName === "config" ? supplierConnectionDouble : {};
  } else {
    logEmitter.emit(
      "functionCall",
      "cosmos.client.js",
      "establishConnectionToCosmos"
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
          "cosmos.client.js",
          "establishConnectionToCosmos",
          err
        );
        throw err;
      }
    }

    DB = client.db(dbName);
    let collection = DB.collection(collectionName);
    logEmitter.emit(
      "functionSuccess",
      "cosmos.client.js",
      "establishConnectionToCosmos"
    );
    return collection;
  }
};

const clearMongoConnection = () => {
  client = undefined;
  DB = undefined;
};

module.exports = { establishConnectionToCosmos, clearMongoConnection };
