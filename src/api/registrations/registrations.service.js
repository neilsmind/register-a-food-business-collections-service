const validateString = value => {
  return typeof value === "string";
};

const validateBoolean = value => {
  return typeof value === "boolean";
};

const validateBooleanString = value => {
  const validValues = ["true", "false"];
  return validValues.includes(value);
};

const doubleModes = ["success", "fail", "update", ""];
const validateDoubleMode = value => {
  return doubleModes.includes(value);
};

const allowedFields = ["metadata", "establishment"];
const validateFields = value => {
  if (!Array.isArray(value)) {
    return false;
  }
  // Checks allowedFields.includes for every element of array. Array.every returns true for empty array
  return value.every(val => allowedFields.includes(val));
};

const validationFields = {
  council: {
    function: validateString,
    message: "council option must be a string"
  },
  double_mode: {
    function: validateDoubleMode,
    message: `double mode option must be one of ${doubleModes}`
  },
  new: {
    function: validateBooleanString,
    message: "new option must be a boolean"
  },
  fields: {
    function: validateFields,
    message: `fields options must be the from the following list: ${allowedFields}`
  },
  collected: {
    function: validateBoolean,
    message: "collected option must be a boolean"
  }
};

const validateOptions = options => {
  for (const key in options) {
    // Check if the validation function for each key returns true or false for the associated value
    if (!validationFields[key].function(options[key])) {
      return validationFields[key].message;
    }
  }
  return true;
};

module.exports = { validateOptions };
