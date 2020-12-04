jest.mock(
  "../../connectors/registrationDb-v2/registrationDb.v2.connector",
  () => ({
    getAllRegistrationsByCouncils: jest.fn(),
    getUnifiedRegistrations: jest.fn(),
    getSingleRegistration: jest.fn(),
    updateRegistrationCollectedByCouncil: jest.fn(),
    registrationDbDouble: jest.fn()
  })
);
jest.mock("../../connectors/configDb/configDb.connector", () => ({
  getCouncilsForSupplier: jest.fn()
}));

jest.mock("../../services/logging.service");
jest.mock("./registrations.v2.service");

const { validateOptions } = require("./registrations.v2.service");

const {
  getAllRegistrationsByCouncils,
  getSingleRegistration,
  getUnifiedRegistrations,
  updateRegistrationCollectedByCouncil
} = require("../../connectors/registrationDb-v2/registrationDb.v2.connector");

const {
  getRegistrationsByCouncil,
  getRegistration,
  getRegistrations,
  updateRegistration
} = require("./registrations.v2.controller");
const {
  getCouncilsForSupplier
} = require("../../connectors/configDb/configDb.connector");

const localAuthorityOptions = {
  subscriber: "cardiff",
  requestedCouncils: ["cardiff"],
  new: "true",
  fields: [],
  before: "2000-01-06",
  after: "2000-01-01"
};

const nonLCSubscriberOptions = {
  subscriber: "northgate",
  requestedCouncils: ["cardiff", "bath"],
  new: "true",
  fields: [],
  before: "2000-01-06",
  after: "2000-01-01"
};

const nonLCSubscriberNoneRequestedOptions = {
  subscriber: "northgate",
  requestedCouncils: ["northgate"],
  new: "true",
  fields: [],
  before: "2000-01-06",
  after: "2000-01-01"
};

describe("registrations.v2.controller", () => {
  let result;
  describe("Function: getRegistrationsByCouncil", () => {
    describe("When given invalid getNewRegistrations option", () => {
      beforeEach(async () => {
        try {
          validateOptions.mockImplementation(() => false);
          await getRegistrationsByCouncil({
            getNewRegistrations: "not a boolean"
          });
        } catch (err) {
          result = err;
        }
      });

      it("should bubble up the error", () => {
        expect(result.name).toBe("optionsValidationError");
      });
    });
    describe("When given double mode", () => {
      beforeEach(async () => {
        validateOptions.mockImplementation(() => true);
        result = await getRegistrationsByCouncil({
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
        validateOptions.mockImplementation(() => true);
        getAllRegistrationsByCouncils.mockImplementation(() => [
          { id: 1, data: "data" }
        ]);
      });
      describe("When susbcriber is a local authority", () => {
        beforeEach(async () => {
          getCouncilsForSupplier.mockImplementation(() => []);
          result = await getRegistrationsByCouncil(localAuthorityOptions);
        });
        it("Should call getAllRegistrationsByCouncils", () => {
          expect(getAllRegistrationsByCouncils).toHaveBeenCalledWith(
            ["cardiff"],
            "true",
            [],
            "2000-01-06",
            "2000-01-01"
          );
        });
        it("Should return the result of getAllRegistrationsByCouncils", () => {
          expect(result).toEqual([{ id: 1, data: "data" }]);
        });
      });
      describe("When susbcriber is not a local authority", () => {
        describe("When requested councils is populated", () => {
          beforeEach(async () => {
            getCouncilsForSupplier.mockImplementation(() => [
              "cardiff",
              "bath",
              "bristol"
            ]);
            result = await getRegistrationsByCouncil(nonLCSubscriberOptions);
          });
          it("Should call getAllRegistrationsByCouncils", () => {
            expect(getAllRegistrationsByCouncils).toHaveBeenCalledWith(
              ["cardiff", "bath"],
              "true",
              [],
              "2000-01-06",
              "2000-01-01"
            );
          });
          it("Should return the result of getAllRegistrationsByCouncils", () => {
            expect(result).toEqual([{ id: 1, data: "data" }]);
          });
        });
        describe("When requested councils is not populated", () => {
          beforeEach(async () => {
            getCouncilsForSupplier.mockImplementation(() => [
              "cardiff",
              "bath",
              "bristol"
            ]);
            result = await getRegistrationsByCouncil(
              nonLCSubscriberNoneRequestedOptions
            );
          });
          it("Should call getAllRegistrationsByCouncils", () => {
            expect(getAllRegistrationsByCouncils).toHaveBeenCalledWith(
              ["cardiff", "bath", "bristol"],
              "true",
              [],
              "2000-01-06",
              "2000-01-01"
            );
          });
          it("Should return the result of getAllRegistrationsByCouncils", () => {
            expect(result).toEqual([{ id: 1, data: "data" }]);
          });
        });
      });
    });
  });

  describe("Function: getRegistration", () => {
    describe("When given invalid option", () => {
      beforeEach(async () => {
        try {
          validateOptions.mockImplementation(() => false);
          await getRegistration({ fsa_rn: "not valid" });
        } catch (err) {
          result = err;
        }
      });

      it("should bubble up the error", () => {
        expect(result.name).toBe("optionsValidationError");
      });
    });
    describe("When given double mode", () => {
      beforeEach(async () => {
        validateOptions.mockImplementation(() => true);
        result = await getRegistration({
          double_mode: "single"
        });
      });
      it("Should return the double response", () => {
        expect(result.establishment.id).toBe(68);
      });
    });
    describe("When successful", () => {
      beforeEach(async () => {
        validateOptions.mockImplementation(() => true);
        getSingleRegistration.mockImplementation(() => ({
          id: 1,
          data: "data"
        }));
        result = await getRegistration({
          getNewRegistrations: "true",
          council: "cardiff"
        });
      });

      it("Should return the result of getSingleRegistration", () => {
        expect(result).toEqual({ id: 1, data: "data" });
      });
    });
  });

  describe("Function: updateRegistration", () => {
    describe("When given invalid collected option", () => {
      beforeEach(async () => {
        validateOptions.mockImplementation(() => false);
        try {
          await updateRegistration({ collected: "true" });
        } catch (err) {
          result = err;
        }
      });

      it("should bubble up the error", () => {
        expect(result.name).toBe("optionsValidationError");
      });
    });
    describe("When given double mode", () => {
      beforeEach(async () => {
        validateOptions.mockImplementation(() => true);
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
        validateOptions.mockImplementation(() => true);
        updateRegistrationCollectedByCouncil.mockImplementation(() => ({
          fsa_rn: "5768",
          collected: true
        }));
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

  describe("Function: getRegistrations", () => {
    describe("When given invalid option", () => {
      beforeEach(async () => {
        validateOptions.mockImplementation(() => false);
        try {
          await getRegistrations({ before: "true" });
        } catch (err) {
          result = err;
        }
      });

      it("should bubble up the error", () => {
        expect(result.name).toBe("optionsValidationError");
      });
    });
    describe("When given double mode", () => {
      beforeEach(async () => {
        validateOptions.mockImplementation(() => true);
        result = await getRegistrations({
          before: "2019-01-01",
          after: "2019-02-01",
          double_mode: "success"
        });
      });
      it("Should return the double response", () => {
        expect(result[0].establishment.id).toBe(68);
      });
    });
    describe("When successful", () => {
      beforeEach(async () => {
        validateOptions.mockImplementation(() => true);
        getUnifiedRegistrations.mockImplementation(() => [
          {
            fsa_rn: "5768",
            collected: true
          }
        ]);
        result = await getRegistrations({
          before: "2019-01-01",
          after: "2019-02-01"
        });
      });
      it("Should return the response", () => {
        expect(result).toEqual([{ fsa_rn: "5768", collected: true }]);
      });
    });
  });
});
