const mockSupplierConfig = require("./mockSupplierConfig.json");

const supplierCollectionDouble = {
  find: () => ({
    toArray: () => mockSupplierConfig
  })
};

module.exports = { supplierCollectionDouble };
