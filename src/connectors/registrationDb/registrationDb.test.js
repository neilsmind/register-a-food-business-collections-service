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
  getEstablishmentByRegId,
  getMetadataByRegId,
  getOperatorByEstablishmentId,
  getPremiseByEstablishmentId,
  getActivitiesByEstablishmentId,
  getRegistrationTableByCouncil,
  getAllRegistrationsByCouncil,
  getNewRegistrationsByCouncil,
  updateRegistrationCollectedToTrue
} = require("./registrationDb");

describe("RegistrationDb connector", () => {
  let result;
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Function: getEstablishmentByRegId", () => {
    describe("When Establishment.findOne fails", () => {
      beforeEach(async () => {
        Establishment.findOne.mockImplementation(() => {
          throw new Error("Failed");
        });
        try {
          await getEstablishmentByRegId("45");
        } catch (err) {
          result = err;
        }
      });

      it("Should return the error", () => {
        expect(result.message).toBe("Failed");
      });
    });

    describe("When Establishment.findOne succeeds", () => {
      beforeEach(async () => {
        Establishment.findOne.mockImplementation(() => {
          return "success";
        });
        result = await getEstablishmentByRegId("45");
      });

      it("Should return the response", () => {
        expect(result).toBe("success");
      });

      it("Should call the findOne model with query", () => {
        expect(Establishment.findOne).toBeCalledWith({
          where: { registrationId: "45" }
        });
      });
    });
  });

  describe("Function: getMetadataByRegId", () => {
    describe("When Metadata.findOne fails", () => {
      beforeEach(async () => {
        Metadata.findOne.mockImplementation(() => {
          throw new Error("Failed");
        });
        try {
          await getMetadataByRegId("45");
        } catch (err) {
          result = err;
        }
      });

      it("Should return the error", () => {
        expect(result.message).toBe("Failed");
      });
    });

    describe("When Metadata.findOne succeeds", () => {
      beforeEach(async () => {
        Metadata.findOne.mockImplementation(() => {
          return "success";
        });
        result = await getMetadataByRegId("45");
      });

      it("Should return the response", () => {
        expect(result).toBe("success");
      });

      it("Should call the findOne model with query", () => {
        expect(Metadata.findOne).toBeCalledWith({
          where: { registrationId: "45" }
        });
      });
    });
  });

  describe("Function: getOperatorByEstablishmentId", () => {
    describe("When Operator.findOne fails", () => {
      beforeEach(async () => {
        Operator.findOne.mockImplementation(() => {
          throw new Error("Failed");
        });
        try {
          await getOperatorByEstablishmentId("45");
        } catch (err) {
          result = err;
        }
      });

      it("Should return the error", () => {
        expect(result.message).toBe("Failed");
      });
    });

    describe("When Operator.findOne succeeds", () => {
      beforeEach(async () => {
        Operator.findOne.mockImplementation(() => {
          return "success";
        });
        result = await getOperatorByEstablishmentId("45");
      });

      it("Should return the response", () => {
        expect(result).toBe("success");
      });

      it("Should call the findOne model with query", () => {
        expect(Operator.findOne).toBeCalledWith({
          where: { establishmentId: "45" }
        });
      });
    });
  });

  describe("Function: getPremiseByEstablishmentId", () => {
    describe("When Operator.findOne fails", () => {
      beforeEach(async () => {
        Premise.findOne.mockImplementation(() => {
          throw new Error("Failed");
        });
        try {
          await getPremiseByEstablishmentId("45");
        } catch (err) {
          result = err;
        }
      });

      it("Should return the error", () => {
        expect(result.message).toBe("Failed");
      });
    });

    describe("When Premise.findOne succeeds", () => {
      beforeEach(async () => {
        Premise.findOne.mockImplementation(() => {
          return "success";
        });
        result = await getPremiseByEstablishmentId("45");
      });

      it("Should return the response", () => {
        expect(result).toBe("success");
      });

      it("Should call the findOne model with query", () => {
        expect(Premise.findOne).toBeCalledWith({
          where: { establishmentId: "45" }
        });
      });
    });
  });

  describe("Function: getActivitiesByEstablishmentId", () => {
    describe("When Activities.findOne fails", () => {
      beforeEach(async () => {
        Activities.findOne.mockImplementation(() => {
          throw new Error("Failed");
        });
        try {
          await getActivitiesByEstablishmentId("45");
        } catch (err) {
          result = err;
        }
      });

      it("Should return the error", () => {
        expect(result.message).toBe("Failed");
      });
    });

    describe("When Activities.findOne succeeds", () => {
      beforeEach(async () => {
        Activities.findOne.mockImplementation(() => {
          return "success";
        });
        result = await getActivitiesByEstablishmentId("45");
      });

      it("Should return the response", () => {
        expect(result).toBe("success");
      });

      it("Should call the findOne model with query", () => {
        expect(Activities.findOne).toBeCalledWith({
          where: { establishmentId: "45" }
        });
      });
    });
  });

  describe("Function: getRegistrationTableByCouncil", () => {
    describe("When Registration.findAll fails", () => {
      beforeEach(async () => {
        Registration.findAll.mockImplementation(() => {
          throw new Error("Failed");
        });
        try {
          await getRegistrationTableByCouncil("council");
        } catch (err) {
          result = err;
        }
      });

      it("Should return the error", () => {
        expect(result.message).toBe("Failed");
      });
    });

    describe("When Registration.findAll succeeds", () => {
      beforeEach(async () => {
        Registration.findAll.mockImplementation(() => {
          return "success";
        });
        result = await getRegistrationTableByCouncil("council");
      });

      it("Should return the response", () => {
        expect(result).toBe("success");
      });

      it("Should call the Registration findAll model with query", () => {
        expect(Registration.findAll).toBeCalledWith({
          where: { council: "council" }
        });
      });
    });
  });

  // get all registrations by council
  describe("Function: getAllRegistrationsByCouncil", () => {
    let result;
    // Should respond with double response in double mode
    describe("When running in double mode", () => {
      beforeEach(async () => {
        process.env.DOUBLE_MODE = "true";
        result = await getAllRegistrationsByCouncil("west-dorset");
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

    describe("When not running in double mode", () => {
      beforeEach(async () => {
        process.env.DOUBLE_MODE = "false";
        Registration.findAll.mockImplementation(() => {
          return [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
        });
        result = await getAllRegistrationsByCouncil("west-dorset");
      });

      it("it should call Registration.findAll with council", () => {
        expect(Registration.findAll.mock.calls[0][0].where).toEqual({
          council: "west-dorset"
        });
      });

      it("it should call the models the appropriate numbers of times", () => {
        expect(Operator.findOne.mock.calls.length).toBe(4);
      });
    });
  });

  describe("Function: getNewRegistrationsByCouncil", () => {
    let result;
    // Should respond with double response in double mode
    describe("When running in double mode", () => {
      beforeEach(async () => {
        process.env.DOUBLE_MODE = "true";
        result = await getNewRegistrationsByCouncil("west-dorset");
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

    describe("When not running in double mode", () => {
      beforeEach(async () => {
        process.env.DOUBLE_MODE = "false";
        Registration.findAll.mockImplementation(() => {
          return [
            { id: 1, collected: null },
            { id: 2, collected: true },
            { id: 3, collected: null },
            { id: 4, collected: true }
          ];
        });
        result = await getNewRegistrationsByCouncil("west-dorset");
      });

      it("it should call Registration.findAll with council and collected", () => {
        expect(Registration.findAll.mock.calls[0][0].where).toEqual({
          council: "west-dorset",
          collected: null
        });
      });

      it("it should call the models the appropriate numbers of times", () => {
        expect(Operator.findOne.mock.calls.length).toBe(4);
      });
    });
  });

  describe("Function:  updateRegistrationCollectedToTrue", () => {
    beforeEach(async () => {
      await updateRegistrationCollectedToTrue("west-dorset");
    });

    it("it should call Registration.update with collected: true", () => {
      expect(Registration.update.mock.calls[0][0].collected).toBe(true);
    });

    it("it should call Registration.update with collected_at in the ISO date format", () => {
      const date = Registration.update.mock.calls[0][0].collected_at;
      expect(validator.isISO8601(date)).toBe(true);
    });

    it("it should call Registration.update with the specified council", () => {
      expect(Registration.update.mock.calls[0][1].where.council).toBe(
        "west-dorset"
      );
    });
  });
});
