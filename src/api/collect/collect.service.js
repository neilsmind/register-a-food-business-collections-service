const {
  registrationDbDouble
} = require("../../connectors/registrationDb/registrationDb.double");
const {
  getRegistrationTableByCouncil,
  getRegistrationTableByCouncilAndNew,
  getFullRegistration,
  updateRegistrationCollectedToTrue
} = require("../../connectors/registrationDb/registrationDb.connector");

const getAllRegistrationsByCouncil = async (council, options) => {
  if (options.double_mode) {
    return registrationDbDouble(options.double_mode);
  }

  const registrationPromises = [];
  const registrations = await getRegistrationTableByCouncil(council);

  if (options.mark_as_collected === "true") {
    await updateRegistrationCollectedToTrue(council);
  }

  registrations.forEach(registration => {
    registrationPromises.push(getFullRegistration(registration));
  });
  const fullRegistrations = await Promise.all(registrationPromises);

  return fullRegistrations;
};

const getNewRegistrationsByCouncil = async (council, options) => {
  if (options.double_mode) {
    return registrationDbDouble(options.double_mode);
  }

  const registrationPromises = [];
  const registrations = await getRegistrationTableByCouncilAndNew(council);
  await updateRegistrationCollectedToTrue(council);

  registrations.forEach(registration => {
    registrationPromises.push(getFullRegistration(registration));
  });
  const fullRegistrations = await Promise.all(registrationPromises);

  return fullRegistrations;
};

module.exports = {
  getAllRegistrationsByCouncil,
  getNewRegistrationsByCouncil
};
