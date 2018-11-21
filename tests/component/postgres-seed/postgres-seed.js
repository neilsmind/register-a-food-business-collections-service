const request = require("request-promise-native");
const mockRegistrationData = require("./mock-registration-data.json");

const seedPostgres = async () => {
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

    response = await request(requestOptions);
    responses.push(response);
  }

  return responses;
};

seedPostgres().then(result => {
  console.log(result);
});
