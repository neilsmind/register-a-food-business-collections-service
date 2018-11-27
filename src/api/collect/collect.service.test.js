const validator = require("validator");

jest.mock("../../db/db", () => ({
  Activities: {
    findOne: jest.fn()
  },
  Establishment: {
    findOne: jest.fn()
  },
  Metadata: {
    findOne: jest.fn()
  },
  Operator: {
    findOne: jest.fn()
  },
  Premise: {
    findOne: jest.fn()
  },
  Registration: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn()
  }
}));

const {
  Activities,
  Establishment,
  Metadata,
  Operator,
  Premise,
  Registration
} = require("../../db/db");

const {
  getAllRegistrationsByCouncil,
  getNewRegistrationsByCouncil
} = require("./collect.service");

describe("collect.service", () => {
  let result;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Function: getAllRegistrationsByCouncil", () => {
    describe("given the request succeeds", () => {
      beforeEach(async () => {
        Registration.findAll.mockImplementation(() => [
          { id: 1, dataValues: { fsa_rn: "1234" } },
          { id: 2, dataValues: { fsa_rn: "5678" } }
        ]);
        Establishment.findOne.mockImplementation(() => ({
          id: 1,
          dataValues: { establishment_trading_name: "taco" }
        }));
        Operator.findOne.mockImplementation(() => ({
          id: 1,
          dataValues: { operator_name: "fred" }
        }));
        Activities.findOne.mockImplementation(() => ({
          id: 1,
          dataValues: { business_type: "cookies" }
        }));
        Premise.findOne.mockImplementation(() => ({
          id: 1,
          dataValues: { establishment_postcode: "ER1 56GF" }
        }));
        Metadata.findOne.mockImplementation(() => ({
          id: 1,
          dataValues: { declaration1: "yes" }
        }));

        result = await getAllRegistrationsByCouncil("west-dorset", {});
      });

      it("should return an array of registrations", async () => {
        expect(Array.isArray(result)).toBe(true);
      });

      it("should return an array, whose first object contains operator, registrations etc", async () => {
        expect(result[0].establishment.establishment_trading_name).toBe("taco");
        expect(result[0].operator.operator_name).toBe("fred");
        expect(result[0].premise.establishment_postcode).toBe("ER1 56GF");
        expect(result[0].metadata.declaration1).toBe("yes");
      });

      describe("given options.mark_as_collected is 'true'", () => {
        beforeEach(async () => {
          Registration.update.mockImplementation(() => [
            {
              collected: true,
              collected_at: "2018-11-14T13:57:49.193Z"
            }
          ]);
          result = await getAllRegistrationsByCouncil("west-dorset", {
            mark_as_collected: "true"
          });
        });

        it("should call Registration.update with collected: true", () => {
          expect(Registration.update.mock.calls[0][0].collected).toBe(true);
        });

        it("should call Registration.update with collected_at in the ISO date format", () => {
          const date = Registration.update.mock.calls[0][0].collected_at;
          expect(validator.isISO8601(date)).toBe(true);
        });
      });
    });

    describe("given [modelName].findOne fails", () => {
      beforeEach(async () => {
        Establishment.findOne.mockImplementation(() => {
          throw new Error("Failed");
        });

        try {
          await getAllRegistrationsByCouncil("west-dorset", {});
        } catch (err) {
          result = err;
        }
      });

      it("should throw the error and catch it", () => {
        expect(result.message).toBe("Failed");
      });
    });

    describe("given [modelName].findAll fails", () => {
      beforeEach(async () => {
        Registration.findAll.mockImplementation(() => {
          throw new Error("Failed");
        });

        try {
          await getAllRegistrationsByCouncil("west-dorset", {});
        } catch (err) {
          result = err;
        }
      });

      it("should throw the error and catch it", () => {
        expect(result.message).toBe("Failed");
      });
    });

    describe("given options.double_mode is 'success'", () => {
      beforeEach(async () => {
        result = await getAllRegistrationsByCouncil("west-dorset", {
          double_mode: "success"
        });
      });

      it("should use the double data", () => {
        expect(result[0].establishment.establishment_trading_name).toBe("Itsu");
      });

      it("Should not call the mocked models", () => {
        expect(Activities.findOne).not.toHaveBeenCalled();
        expect(Establishment.findOne).not.toHaveBeenCalled();
        expect(Metadata.findOne).not.toHaveBeenCalled();
        expect(Operator.findOne).not.toHaveBeenCalled();
        expect(Premise.findOne).not.toHaveBeenCalled();
        expect(Registration.findAll).not.toHaveBeenCalled();
      });
    });
  });

  describe("Function: getNewRegistrationsByCouncil", () => {
    describe("given the request succeeds", () => {
      beforeEach(async () => {
        Registration.findAll.mockImplementation(() => [
          { id: 1, dataValues: { fsa_rn: "1234" } },
          { id: 2, dataValues: { fsa_rn: "5678" } }
        ]);
        Establishment.findOne.mockImplementation(() => ({
          id: 1,
          dataValues: { establishment_trading_name: "taco" }
        }));
        Operator.findOne.mockImplementation(() => ({
          id: 1,
          dataValues: { operator_name: "fred" }
        }));
        Activities.findOne.mockImplementation(() => ({
          id: 1,
          dataValues: { business_type: "cookies" }
        }));
        Premise.findOne.mockImplementation(() => ({
          id: 1,
          dataValues: { establishment_postcode: "ER1 56GF" }
        }));
        Metadata.findOne.mockImplementation(() => ({
          id: 1,
          dataValues: { declaration1: "yes" }
        }));
        Registration.update.mockImplementation(() => [
          {
            collected: true,
            collected_at: "2018-11-14T13:57:49.193Z"
          }
        ]);

        result = await getNewRegistrationsByCouncil("west-dorset", {});
      });

      it("should return an array of registrations", async () => {
        expect(Array.isArray(result)).toBe(true);
      });

      it("should return an array, whose first object contains operator, registrations etc", async () => {
        expect(result[0].establishment.establishment_trading_name).toBe("taco");
        expect(result[0].operator.operator_name).toBe("fred");
        expect(result[0].premise.establishment_postcode).toBe("ER1 56GF");
        expect(result[0].metadata.declaration1).toBe("yes");
      });

      it("should call Registration.update with collected: true", () => {
        expect(Registration.update.mock.calls[0][0].collected).toBe(true);
      });

      it("should call Registration.update with collected_at in the ISO date format", () => {
        const date = Registration.update.mock.calls[0][0].collected_at;
        expect(validator.isISO8601(date)).toBe(true);
      });
    });

    describe("given [modelName].findOne fails", () => {
      beforeEach(async () => {
        Establishment.findOne.mockImplementation(() => {
          throw new Error("Failed");
        });

        try {
          await getNewRegistrationsByCouncil("west-dorset", {});
        } catch (err) {
          result = err;
        }
      });

      it("should throw the error and catch it", () => {
        expect(result.message).toBe("Failed");
      });
    });

    describe("given [modelName].findAll fails", () => {
      beforeEach(async () => {
        Registration.findAll.mockImplementation(() => {
          throw new Error("Failed");
        });

        try {
          await getNewRegistrationsByCouncil("west-dorset", {});
        } catch (err) {
          result = err;
        }
      });

      it("should throw the error and catch it", () => {
        expect(result.message).toBe("Failed");
      });
    });

    describe("given options.double_mode is 'success'", () => {
      beforeEach(async () => {
        result = await getNewRegistrationsByCouncil("west-dorset", {
          double_mode: "success"
        });
      });

      it("should use the double data", () => {
        expect(result[0].establishment.establishment_trading_name).toBe("Itsu");
      });

      it("Should not call the mocked models", () => {
        expect(Activities.findOne).not.toHaveBeenCalled();
        expect(Establishment.findOne).not.toHaveBeenCalled();
        expect(Metadata.findOne).not.toHaveBeenCalled();
        expect(Operator.findOne).not.toHaveBeenCalled();
        expect(Premise.findOne).not.toHaveBeenCalled();
        expect(Registration.findAll).not.toHaveBeenCalled();
      });
    });
  });
});
