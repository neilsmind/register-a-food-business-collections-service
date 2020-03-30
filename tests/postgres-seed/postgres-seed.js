require("dotenv").config();

const request = require("request-promise-native");
const mockRegistrationData = require("./mock-registration-data.json");

const submitRegistration = async () => {
  const url = process.env.SERVICE_API_URL;

  const responses = [];

  for (let index in mockRegistrationData) {
    const requestOptions = {
      uri: url,
      method: "POST",
      json: true,
      body: mockRegistrationData[index],
      headers: {
        "api-secret": process.env.SERVICE_API_SECRET,
        "client-name": process.env.SERVICE_API_CLIENT_NAME,
        "registration-data-version": process.env.REGISTRATION_DATA_VERSION
      }
    };

    const response = await request(requestOptions);
    responses.push(response);
  }
}

const forceRegistrationSubmission = async (submissionResult) => {
  const url = process.env.COMPONENT_TEST_BASE_URL + "/savetotempstore/";

  const responses = [];

  for (let registration in submissionResult) {
    const requestOptions = {
      uri: url + "?fsaID=" + registration.fsa-rn,
      method: "GET",
      json: true,
      body: null,
      headers: {
        "api-secret": process.env.SERVICE_API_SECRET,
        "client-name": process.env.SERVICE_API_CLIENT_NAME,
        "registration-data-version": process.env.REGISTRATION_DATA_VERSION
      }
    };

    const response = await request(requestOptions);
    responses.push(response);
  }

  return responses;
};

submitRegistration()
  .then(submissionResult => forceRegistrationSubmission(submissionResult))
  .then(seedResult => console.log(seedResult));

