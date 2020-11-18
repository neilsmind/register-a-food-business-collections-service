const { transformEnums } = require("./transform.service");

let registrations = [
  {
    establishment: {
      establishment_details: {
        establishment_trading_name: "Testing name",
        establishment_primary_number: "09876 54321"
      },
      operator: {
        operator_first_name: "Tom",
        operator_last_name: "Healey",
        operator_type: "Sole trader"
      },
      premise: {
        establishment_postcode: "NR14 7PZ",
        establishment_town: "Norwich",
        establishment_type: "Mobile or moveable premises",
        establishment_address_line_1: "Test 1 Ltd"
      },
      activities: {
        customer_type: "End consumer",
        business_type: "Any other retailer",
        import_export_activities: "None",
        water_supply: "Private"
      }
    }
  },
  {
    establishment: {
      establishment_details: {
        establishment_trading_name: "Trading name",
        establishment_primary_number: "01234 456789"
      },
      operator: {
        operator_first_name: "Jeff",
        operator_last_name: "Healey",
        operator_type: "SOLETRADER"
      },
      premise: {
        establishment_postcode: "NR14 7PZ",
        establishment_town: "Norwich",
        establishment_type: "MOBILE",
        establishment_address_line_1: "Test 2 Ltd"
      },
      activities: {
        customer_type: "END_CONSUMER",
        business_type: "048",
        import_export_activities: "NONE",
        water_supply: "PRIVATE"
      }
    }
  }
];

describe("transform.service", () => {
  describe("When api version is >= 2", () => {
    describe("When passed a single registration", () => {
      beforeEach(() => {
        transformEnums("2", registrations[0]);
      });

      it("Should not perform any transform", () => {
        expect(registrations[1].establishment.operator.operator_type).toEqual(
          "SOLETRADER"
        );
        expect(
          registrations[1].establishment.operator.operator_first_name
        ).toEqual("Jeff");
      });
    });
    describe("When passed an array of registration", () => {
      beforeEach(() => {
        transformEnums("2", registrations);
      });

      it("Should not perform any transform", () => {
        expect(
          registrations[0].establishment.premise.establishment_type
        ).toEqual("Mobile or moveable premises");
        expect(
          registrations[1].establishment.premise.establishment_type
        ).toEqual("MOBILE");
        expect(
          registrations[1].establishment.operator.operator_first_name
        ).toEqual("Jeff");
        expect(registrations[1].establishment.activities.business_type).toEqual(
          "048"
        );
      });
    });
  });
  describe("When api version is latest", () => {
    describe("When passed a single registration", () => {
      beforeEach(() => {
        transformEnums("latest", registrations[0]);
      });
      it("Should not perform any transform", () => {
        expect(registrations[1].establishment.activities.customer_type).toEqual(
          "END_CONSUMER"
        );
        expect(
          registrations[1].establishment.operator.operator_first_name
        ).toEqual("Jeff");
      });
    });
    describe("When passed an array of registration", () => {
      beforeEach(() => {
        transformEnums("latest", registrations);
      });
      it("Should not perform any transform", () => {
        expect(
          registrations[0].establishment.activities.import_export_activities
        ).toEqual("None");
        expect(
          registrations[1].establishment.activities.import_export_activities
        ).toEqual("NONE");
        expect(
          registrations[1].establishment.operator.operator_first_name
        ).toEqual("Jeff");
        expect(registrations[1].establishment.activities.business_type).toEqual(
          "048"
        );
      });
    });
  });
  describe("When api version is < 2", () => {
    describe("When passed a single registration", () => {
      beforeEach(() => {
        transformEnums("1", registrations[1]);
      });
      it("Should only tranform enum keys to enum values", () => {
        expect(registrations[1].establishment.activities.water_supply).toEqual(
          "Private"
        );
        expect(
          registrations[0].establishment.operator.operator_first_name
        ).toEqual("Tom");
      });
    });
    describe("When passed an array of registrations", () => {
      beforeEach(() => {
        transformEnums("1", registrations);
      });

      it("Should only tranform enum keys to enum values", () => {
        expect(
          registrations[1].establishment.activities.import_export_activities
        ).toEqual("None");
        expect(
          registrations[0].establishment.activities.import_export_activities
        ).toEqual("None");
        expect(
          registrations[1].establishment.operator.operator_first_name
        ).toEqual("Jeff");
        expect(registrations[1].establishment.activities.business_type).toEqual(
          "Market stalls with permanent pitch"
        );
      });
    });
  });
});
