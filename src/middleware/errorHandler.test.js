const { errorHandler } = require("./errorHandler");

const res = {
  status: jest.fn(),
  send: jest.fn()
};

describe("Middleware: errorHandler", () => {
  describe("When given an error", () => {
    it("Should return unknown error", () => {
      const error = {
        name: "someError"
      };
      errorHandler(error, "request", res);
      expect(res.status).toBeCalledWith(500);
      expect(res.send.mock.calls[0][0].errorCode).toBe("Unknown");
    });
  });
});
