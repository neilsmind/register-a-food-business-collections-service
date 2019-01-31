const { createLogger } = require("./logger");

describe("logger", () => {
  let logger;
  describe("when initialised without log level", () => {
    beforeEach(() => {
      logger = createLogger("");
    });
    it("should have .info function", () => {
      expect(logger.info).toBeDefined();
    });

    it("should default to log level info", () => {
      expect(logger.level).toBe("info");
    });
  });

  describe("when initialised with a log level", () => {
    beforeEach(() => {
      logger = createLogger("debug");
    });
    it("should have .info function", () => {
      expect(logger.info).toBeDefined();
    });

    it("should set log level to that", () => {
      expect(logger.level).toBe("debug");
    });
  });
});
