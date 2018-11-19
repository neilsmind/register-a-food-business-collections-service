// const request = require("request-promise-native");
// const url = "http://localhost:4001/api/collect/west-dorset/new";

it("a", () => {
  expect(1).toBe(1);
});
// describe("On a GET request to /api/collect/:lc/new", () => {
//   let response;

//   beforeEach(async () => {
//     // reset database
//   });

//   describe("given the request is successful", () => {
//     describe("given that there are new uncollected registrations", () => {
//       beforeEach(async () => {
//         response = await request(url);
//       });

//       it("Should return an array with x number of entries", () => {
//         expect(response.length).toBe("x");
//       });

//       it("Should return an array, whose first object contains operator, registrations, premise, activities and metadata", () => {
//         expect(result[0].registration.fsa_rn).toBe("BLAH");
//         expect(result[0].establishment.establishment_trading_name).toBe("BLAH");
//         expect(result[0].operator.operator_name).toBe("BLAH");
//         expect(result[0].premise.establishment_postcode).toBe("BLAH BLAH");
//         expect(result[0].metadata.declaration1).toBe("BLAH");
//       });

//       it("Should not return the collected and collected_at fields", () => {
//         expect(result[0].registration.collected).toBe(undefined);
//         expect(result[0].registration.collected_at).toBe(undefined);
//       });
//     });

//     describe("given that all registrations have been collected", () => {
//       beforeEach(async () => {
//         await request(url); // get new registrations
//         response = await request(url); // check there are no new registrations
//       });

//       it("Should return an empty array", () => {
//         expect(response.length).toBe(0);
//       });
//     });
//   });

//   describe("given the request fails", () => {});
// });
