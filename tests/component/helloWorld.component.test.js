const request = require("request-promise-native");
const url = "http://localhost:4001/api/collect";

describe("Collections Route: ", () => {
  describe("On a GET request to /api/collect/:lc/all", () => {
    beforeEach(async () => {
      const response = await request(url);
    });
    it("Should return an array with x number of entries", () => {
      expect(response.length).toBe("x");
    });
    it("Should return an array, whose first object contains operator, registrations, premise, activities and metadata", () => {
      expect(result[0].registration.fsa_rn).toBe("BLAH");
      expect(result[0].establishment.establishment_trading_name).toBe("BLAH");
      expect(result[0].operator.operator_name).toBe("BLAH");
      expect(result[0].premise.establishment_postcode).toBe("BLAH BLAH");
      expect(result[0].metadata.declaration1).toBe("BLAH");
      expect(result[0].registration.collected).toBe(true)
    });
  });
  describe("On a GET request to /api/collect/:lc/all", () => {
    beforeEach(async () => {
      const response = await request(url);
    });
    it("Should return an array with x number of entries'", () => {
      expect(response.length).toBe("x");
    });
    it("Should return an array, whose first object contains operator, registrations, premise, activities and metadata", () => {
      expect(result[0].registration.fsa_rn).toBe("BLAH");
      expect(result[0].establishment.establishment_trading_name).toBe("BLAH");
      expect(result[0].operator.operator_name).toBe("BLAH");
      expect(result[0].premise.establishment_postcode).toBe("BLAH BLAH");
      expect(result[0].metadata.declaration1).toBe("BLAH");
    });
    it("Should return an array without the collected and collected_at fields", () => {
      expect(result[0].registration.collected).toBeUndefined();
      expect(result[0].registration.collected_at).toBeUndefined();
    });
    describe("When called twice", () => {
      beforeEach(async () => {
        const response1 = await request(url);  
        const response2 = await request(url);        
      });
  });
});
