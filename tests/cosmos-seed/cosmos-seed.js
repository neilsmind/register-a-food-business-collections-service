const { logEmitter, INFO } = require("../../src/services/logging.service");

logEmitter.emit(INFO, `Seeding registrations`);

require("dotenv").config();

const request = require("request-promise-native");
const mockRegistrationData = require("./mock-registration-data.json");
const council_urls = ["cardiff", "the-vale-of-glamorgan"];
let responses = [];

const directSubmitRegistrations = async () => {
  const url = process.env.SERVICE_API_URL;
  try {
    for (let index in mockRegistrationData) {
      const requestOptions = {
        uri: `${url}/api/registration/v2/createNewDirectRegistration/${council_urls[index]}`,
        method: "POST",
        json: true,
        body: mockRegistrationData[index],
        headers: {
          "client-name": process.env.DIRECT_API_NAME,
          "api-secret": process.env.DIRECT_API_SECRET
        }
      };

      const response = await request(requestOptions);
      responses.push(response);
    }
    logEmitter.emit(INFO, "Registrations seed completed");
    return responses;
  } catch (err) {
    logEmitter.emit(
      "functionFail",
      "directSubmitRegistrations",
      "getStoredStatus",
      err
    );
  }
};

directSubmitRegistrations().then((result) => console.log(result));
