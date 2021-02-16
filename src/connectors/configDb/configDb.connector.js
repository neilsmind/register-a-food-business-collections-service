const { logEmitter } = require("../../services/logging.service");
const { establishConnectionToCosmos } = require("../cosmos.client");

const getCouncilsForSupplier = async (url) => {
  logEmitter.emit(
    "functionCall",
    "configDb.connector",
    "getCouncilsForSupplier"
  );

  let councils = [];

  try {
    const supplierConfigCollection = await establishConnectionToCosmos(
      "config",
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
  getCouncilsForSupplier
};
