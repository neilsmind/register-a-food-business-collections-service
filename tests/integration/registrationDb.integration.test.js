const {
  getAllRegistrationsByCouncil
} = require("../../src/connectors/registrationDb/registrationDb.connector");

const { db } = require("../../src/db/db");

describe("registrationDb.connector integration: getRegistrationsByCouncil", () => {
  it("Should return list of registrations from council", async () => {
    process.env.DOUBLE_MODE = "true";
    const result = await getAllRegistrationsByCouncil("west-dorset");
    db.sequelize.close();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].registration.fsa_rn).toBeDefined();
    expect(result[0].registration.council).toBeDefined();
    expect(result[0].establishment.establishment_trading_name).toBeDefined();
    expect(result[0].operator.operator_type).toBeDefined();
    expect(result[0].activities.business_type).toBeDefined();
    expect(result[0].premise.establishment_type).toBeDefined();
    expect(result[0].metadata.declaration1).toBeDefined();
  });
});
