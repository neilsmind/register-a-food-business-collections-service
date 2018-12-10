const request = require("request-promise-native");
const baseUrl = process.env.COMPONENT_TEST_BASE_URL || "http://localhost:4001";
const url = `${baseUrl}/api/collect/cardiff/all`;

describe("On a GET request to /api/collect/:lc/all", () => {
  let response;

  describe("given the request is successful", () => {
    beforeAll(async () => {
      const requestOptions = {
        uri: url,
        json: true
      };
      response = await request(requestOptions);
    });

    it("Should return an array with x number of entries", () => {
      expect(response.length).toBe(1);
    });

    it("Should return an array, whose first object contains operator, registrations, premise, activities and metadata", () => {
      expect(typeof response[0].registration.fsa_rn).toBe("string");
      expect(typeof response[0].establishment.establishment_trading_name).toBe(
        "string"
      );
      expect(typeof response[0].operator.operator_first_name).toBe("string");
      expect(typeof response[0].premise.establishment_postcode).toBe("string");
      expect(typeof response[0].metadata.declaration1).toBe("string");
    });

    it("Should not return the collected and collected_at fields", () => {
      expect(response[0].registration.collected).toBe(undefined);
      expect(response[0].registration.collected_at).toBe(undefined);
    });

    it("should return the same response more than once", async () => {
      const requestOptions = {
        uri: url,
        json: true
      };
      const response2 = await request(requestOptions);
      expect(response).toEqual(response2);
    });
  });

  describe("given the request fails", () => {
    beforeAll(async () => {
      const requestOptions = {
        uri: url,
        headers: {
          "double-mode": "fail"
        },
        json: true
      };
      try {
        await request(requestOptions);
      } catch (err) {
        response = err;
      }
    });

    it("Should return the correct error status of 500", () => {
      expect(response.statusCode).toBe(500);
    });
  });
});
