const { OperatorTypeEnum } = require("../enums");

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
};

const transformToKey = (enumType, value) => {
  let transformedValue = value;
  enumType.enums.forEach(function (enumItem) {
    if (enumItem.value === value) {
      transformedValue = enumItem.key;
    }
  });
  return transformedValue;
};

const transformToValue = (enumType, key) => {
  if (enumType.get(key)) {
    return enumType.get(key).value;
  }
  return key;
};

module.exports = { transformEnums };
