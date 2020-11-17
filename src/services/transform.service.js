const {
  operatorTypeEnum,
  establishmentTypeEnum,
  customerTypeEnum,
  importExportEnum,
  waterSupplyEnum,
  businessTypeEnum
} = require("@slice-and-dice/register-a-food-business-validation");
const { logEmitter } = require("./logging.service");

const transformEnums = (apiVersion, registrations) => {
  logEmitter.emit("functionCall", "transform.service", "transformEnums");
  let transform =
    Number(apiVersion) >= 2 || apiVersion === "latest"
      ? transformToKey
      : transformToValue;

  // DB data has been migrated to new format so only need to do this for pre-v1 APIs
  if (Number(apiVersion) < 2) {
    if (Array.isArray(registrations)) {
      registrations.forEach(function (reg) {
        applyTransforms(reg, transform);
      });
    } else {
      applyTransforms(registrations, transform);
    }
  }
};

const applyTransforms = (registration, transform) => {
  logEmitter.emit("functionCall", "transform.service", "applyTransforms");
  registration.establishment.operator.operator_type = transform(
    operatorTypeEnum,
    registration.establishment.operator.operator_type
  );
  registration.establishment.premise.establishment_type = transform(
    establishmentTypeEnum,
    registration.establishment.premise.establishment_type
  );
  registration.establishment.activities.customer_type = transform(
    customerTypeEnum,
    registration.establishment.activities.customer_type
  );
  registration.establishment.activities.import_export_activities = transform(
    importExportEnum,
    registration.establishment.activities.import_export_activities
  );
  registration.establishment.activities.water_supply = transform(
    waterSupplyEnum,
    registration.establishment.activities.water_supply
  );
  registration.establishment.activities.business_type = transform(
    businessTypeEnum,
    registration.establishment.activities.business_type
  );
};

const transformToKey = (enumType, value) => {
  logEmitter.emit("functionCall", "transform.service", "transformToKey");
  let transformedValue = value;
  Object.keys(enumType).forEach(function (enumKey) {
    if (enumType[enumKey].value === value) {
      transformedValue = enumType[enumKey].key;
    }
  });
  return transformedValue;
};

const transformToValue = (enumType, key) => {
  logEmitter.emit("functionCall", "transform.service", "transformToValue");
  if (enumType[key]) {
    return enumType[key].value;
  }
  return key;
};

module.exports = { transformEnums };
