"use strict";
const logger = require("winston");
logger.info(`Seeding tables`);

require("dotenv").config();

const request = require("request-promise-native");
const mockRegistrationData = require("./mock-registration-data.json");
let responses = [];

const submitRegistration = async () => {
  const url = process.env.SERVICE_API_URL;

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

  return responses;
};

const forceRegistrationSubmission = async (submissionResult) => {
  const url = process.env.SERVICE_BASE_URL + "/api/tasks/savetotempstore";

  responses = Promise.all(
    submissionResult.map((registration) => {
      const requestOptions = {
        uri: url + "/" + registration["fsa-rn"],
        method: "GET",
        headers: {
          "api-secret": process.env.SERVICE_API_SECRET,
          "client-name": process.env.SERVICE_API_CLIENT_NAME,
          "registration-data-version": process.env.REGISTRATION_DATA_VERSION
        }
      };

      return request(requestOptions);
    })
  );

  return responses;
};

submitRegistration()
  .then((submissionResult) => forceRegistrationSubmission(submissionResult))
  .then((seedResult) => console.log(seedResult));
