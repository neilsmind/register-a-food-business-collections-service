const Enum = require("enum");

const OperatorTypeEnum = new Enum({
  SOLETRADER: "Sole trader",
  PARTNERSHIP: "Partnership",
  PERSON: "A person (registered by a representative)",
  COMPANY: "A company (registered by a representative)",
  CHARITY: "A charity (registered by a representative)"
});

module.exports = { OperatorTypeEnum };
