const {
  getAllRegistrationsByCouncil
} = require("../../src/connectors/registrationDb/registrationDb.connector");

const { db } = require("../../src/db/db");

let doubleResult;
let realResult;

describe("registrationDb.connector integration: getRegistrationsByCouncil", () => {
  beforeEach(async () => {
    doubleResult = await getAllRegistrationsByCouncil("west-dorset", {
      double_mode: "success"
    });
    realResult = await getAllRegistrationsByCouncil("west-dorset", {});
    db.sequelize.close();
  });

  it("Should return list of registrations from council", async () => {
    expect(realResult[0].registration.fsa_rn).toBeDefined();
    expect(realResult[0].registration.council).toBeDefined();
    expect(
      realResult[0].establishment.establishment_trading_name
    ).toBeDefined();
    expect(realResult[0].operator.operator_type).toBeDefined();
    expect(realResult[0].activities.business_type).toBeDefined();
    expect(realResult[0].premise.establishment_type).toBeDefined();
    expect(realResult[0].metadata.declaration1).toBeDefined();
    expect(doubleResult[0].registration.fsa_rn).toBeDefined();
    expect(doubleResult[0].registration.council).toBeDefined();
    expect(
      doubleResult[0].establishment.establishment_trading_name
    ).toBeDefined();
    expect(doubleResult[0].operator.operator_type).toBeDefined();
    expect(doubleResult[0].activities.business_type).toBeDefined();
    expect(doubleResult[0].premise.establishment_type).toBeDefined();
    expect(doubleResult[0].metadata.declaration1).toBeDefined();
  });
});
