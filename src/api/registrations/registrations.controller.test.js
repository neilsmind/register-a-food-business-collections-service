jest.mock("../../connectors/registrationDb/registrationDb.connector", () => ({
  getAllRegistrations: jest.fn(),
  updateRegistrationCollected: jest.fn(),
  registrationDbDouble: jest.fn()
}));

const {
  getAllRegistrations,
  updateRegistrationCollected
} = require("../../connectors/registrationDb/registrationDb.connector");

const {
  getRegistrations,
  updateRegistration
} = require("./registrations.controller");

describe("registrations.controller", () => {
  let result;
  describe("Function: getRegistrations", () => {
    describe("When given invalid getNewRegistrations option", () => {
      beforeEach(async () => {
        try {
          await getRegistrations({ getNewRegistrations: "not a boolean" });
        } catch (err) {
          result = err;
        }
      });

      it("should bubble up the error", () => {
        expect(result.name).toBe("getNewRegistrationsError");
      });
    });
    describe("When given double mode", () => {
      beforeEach(async () => {
        result = await getRegistrations({
          getNewRegistrations: "true",
          double_mode: "success"
        });
      });
      it("Should return the double response", () => {
        expect(result[0].establishment.id).toBe(68);
      });
    });
    describe("When successful", () => {
      beforeEach(async () => {
        getAllRegistrations.mockImplementation(() => [{ id: 1, data: "data" }]);
        result = await getRegistrations({
          getNewRegistrations: "true",
          council: "cardiff"
        });
      });

      it("Should return the result of getAllRegistrations", () => {
        expect(result).toEqual([{ id: 1, data: "data" }]);
      })
    });
  });

  describe("Function: updateRegistration", () => {
    describe("When given invalid collected option", () => {
      beforeEach(async () => {
        try {
          await updateRegistration({ collected: "true" });
        } catch (err) {
          result = err;
        }
      });

      it("should bubble up the error", () => {
        expect(result.name).toBe("updateCollectedError");
      });
    });
    describe("When given double mode", () => {
      beforeEach(async () => {
        result = await updateRegistration({
          collected: true,
          double_mode: "update"
        });
      });
      it("Should return the double response", () => {
        expect(result).toEqual({ fsa_rn: "1234", collected: true });
      });
    });
    describe("When successful", () => {
      beforeEach(async () => {
        updateRegistrationCollected.mockImplementation(() => ({
          fsa_rn: "5768",
          collected: true
        }))
        result = await updateRegistration({
          collected: true,
          fsa_rn: "5768"
        });
      });
      it("Should return the response of updateRegistrationCollected", () => {
        expect(result).toEqual({ fsa_rn: "5768", collected: true });
      });
    });
  });
});
