const OperatorTypeEnum = {
  SOLETRADER: {
    key: "SOLETRADER",
    value: "Sole trader"
  },
  PARTNERSHIP: {
    key: "PARTNERSHIP",
    value: "Partnership"
  },
  PERSON: {
    key: "PERSON",
    value: "A person (registered by a representative)"
  },
  COMPANY: {
    key: "COMPANY",
    value: "A company (registered by a representative)"
  },
  CHARITY: {
    key: "CHARITY",
    value: "A charity (registered by a representative)"
  }
};

const EstablishmentTypeEnum = {
  COMMERCIAL: {
    key: "COMMERCIAL",
    value: "Place of business or commercial premises"
  },
  MOBILE: {
    key: "MOBILE",
    value: "Mobile or moveable premises"
  },
  DOMESTIC: {
    key: "DOMESTIC",
    value: "Home or domestic premises"
  }
};

const CustomerTypeEnum = {
  OTHER_BUSINESSES: {
    key: "OTHER_BUSINESSES",
    value: "Other businesses"
  },
  END_CONSUMER: {
    key: "END_CONSUMER",
    value: "End consumer"
  },
  BOTH: {
    key: "BOTH",
    value: "End consumer and other businesses"
  }
};

const ImportExportActivitiesEnum = {
  IMPORT: {
    key: "IMPORT",
    value: "Directly import"
  },
  EXPORT: {
    key: "EXPORT",
    value: "Directly export"
  },
  BOTH: {
    key: "BOTH",
    value: "Directly import and export"
  },
  NONE: {
    key: "NONE",
    value: "None"
  }
};

const WaterSupplyEnum = {
  PUBLIC: {
    key: "PUBLIC",
    value: "Public"
  },
  PRIVATE: {
    key: "PRIVATE",
    value: "Private"
  },
  BOTH: {
    key: "BOTH",
    value: "Public and private"
  }
};

module.exports = {
  OperatorTypeEnum,
  EstablishmentTypeEnum,
  CustomerTypeEnum,
  ImportExportActivitiesEnum,
  WaterSupplyEnum
};
