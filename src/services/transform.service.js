const { RegistrationRoleEnum } = require("../../../register-a-food-business-front-end/src/enums");
const { OperatorTypeEnum, EstablishmentTypeEnum, CustomerTypeEnum, ImportExportActivitiesEnum, WaterSupplyEnum } = require("../enums");

const transformEnums = (apiVersion, registrations) => {
  let transform =
    Number(apiVersion) >= 2 || apiVersion === "latest"
      ? transformToKey
      : transformToValue;
  if (Array.isArray(registrations)) {
    registrations.forEach(function (reg) {
      applyTransforms(reg, transform);
    });
  } else {
    applyTransforms(registrations, transform);
  }
};

const applyTransforms = (registration, transform) => {
  registration.establishment.operator.operator_type = transform(
    OperatorTypeEnum,
    registration.establishment.operator.operator_type
  );
  registration.establishment.premise.establishment_type = transform(
    EstablishmentTypeEnum,
    registration.establishment.premise.establishment_type
  );
  registration.establishment.activities.customer_type = transform(
    CustomerTypeEnum,
    registration.establishment.activities.customer_type
  );
  registration.establishment.activities.import_export_activities = transform(
    ImportExportActivitiesEnum,
    registration.establishment.activities.import_export_activities
  );
  registration.establishment.activities.water_supply = transform(
    WaterSupplyEnum,
    registration.establishment.activities.water_supply
  );
};

const transformToKey = (enumType, value) => {
  let transformedValue = value;
  Object.keys(enumType).forEach(function (enumKey) {
    if (enumType[enumKey].value === value) {
      transformedValue = enumType[enumKey].key;
    }
  });
  return transformedValue;
};

const transformToValue = (enumType, key) => {
  if (enumType[key]) {
    return enumType[key].value;
  }
  return key;
};

module.exports = { transformEnums };
