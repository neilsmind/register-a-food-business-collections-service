const request = require("request-promise-native");
const url = "http://localhost:4001/api/collect";

describe("Collections Route: ", () => {
  describe("On a GET request to /api/collect", () => {
    it("Should return 'hello world'", async () => {
      const response = await request(url);
      expect(response).toBe("hello world");
    });
  });
});
