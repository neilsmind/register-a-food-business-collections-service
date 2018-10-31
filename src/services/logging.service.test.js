jest.mock("./logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

jest.unmock("./logging.service");

const { logger } = require("./logger");
const { logEmitter } = require("./logging.service");

describe("logEmitter", () => {
  describe("on functionCall event", () => {
    it("should call winston info", () => {
      logEmitter.emit("functionCall");
      expect(logger.info).toBeCalled();
    });
  });

  describe("on functionSuccess event", () => {
    it("should call winston info", () => {
      logEmitter.emit("functionSuccess");
      expect(logger.info).toBeCalled();
    });
  });

  describe("on functionFail event", () => {
    it("should call winston error", () => {
      logEmitter.emit("functionFail", "module", "function", {
        message: "error"
      });
      expect(logger.error).toBeCalled();
    });
  });

  describe("on doubleMode event", () => {
    it("should call winston info", () => {
      logEmitter.emit("doubleMode");
      expect(logger.info).toBeCalled();
    });
  });
});
