const request = require("request-promise-native");
const url = "http://localhost:4001/api/collect/west-dorset/all";

describe("On a GET request to /api/collect/:lc/all", () => {
  let response;
  // beforeEach(async () => {
  //   response = await request(url);
  // });
  // describe("given the request is successful", () => {
  //   it("Should return an array with x number of entries", () => {
  //     expect(response.length).toBe("x");
  //   });
  //   it("Should return an array, whose first object contains operator, registrations, premise, activities and metadata", () => {
  //     expect(result[0].registration.fsa_rn).toBe("BLAH");
  //     expect(result[0].establishment.establishment_trading_name).toBe("BLAH");
  //     expect(result[0].operator.operator_name).toBe("BLAH");
  //     expect(result[0].premise.establishment_postcode).toBe("BLAH BLAH");
  //     expect(result[0].metadata.declaration1).toBe("BLAH");
  //   });
  //   it("Should not return the collected and collected_at fields", () => {
  //     expect(result[0].registration.collected).toBe(undefined);
  //     expect(result[0].registration.collected_at).toBe(undefined);
  //   });
  // });

  describe("given the request fails", () => {
    beforeEach(async () => {
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
