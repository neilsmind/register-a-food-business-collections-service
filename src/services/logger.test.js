const { logger } = require("./logger");

describe("logger", () => {
  describe("when initialised", () => {
    it("should have .info function", () => {
      expect(logger.info).toBeDefined();
    });
  });
});
