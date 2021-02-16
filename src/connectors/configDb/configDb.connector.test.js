jest.mock("mongodb");
jest.mock("./configDb.double");

const mongodb = require("mongodb");
const { getCouncilsForSupplier } = require("./configDb.connector");
const { clearMongoConnection } = require("../cosmos.client");
const mockSupplierConfig = require("./mockSupplierConfig.json");

let result;

describe("Function: getCouncilsForSupplier", () => {
  const testSupplier = "testSupplier";

  describe("given the request throws an error", () => {
    beforeEach(async () => {
      clearMongoConnection();
      mongodb.MongoClient.connect.mockImplementation(() => {
        throw new Error("example mongo error");
      });

      try {
        await getCouncilsForSupplier(testSupplier);
      } catch (err) {
        result = err;
      }
    });

    describe("when the error shows that the connection has failed", () => {
      it("should throw mongoConnectionError error", () => {
        expect(result.name).toBe("mongoConnectionError");
        expect(result.message).toBe("example mongo error");
      });
    });
  });

  describe("given the request is successful", () => {
    beforeEach(() => {
      clearMongoConnection();
      mongodb.MongoClient.connect.mockImplementation(() => ({
        db: () => ({
          collection: () => ({
            findOne: () => mockSupplierConfig[0]
          })
        })
      }));
    });

    it("should return the data from the findOne() response", async () => {
      await expect(getCouncilsForSupplier(testSupplier)).resolves.toEqual(
        mockSupplierConfig[0].local_council_urls
      );
    });
  });
});
