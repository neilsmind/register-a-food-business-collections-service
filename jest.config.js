module.exports = {
  verbose: true,
  testEnvironment: "node",
  reporters: [
    "default",
    ["jest-junit", { output: `./reports/TEST-${process.env.TEST_TYPE}.xml` }]
  ],
  coverageReporters: ["cobertura", "lcov", "json", "text"],
  collectCoverageFrom: [
    "**/*.{js}",
    "!**/node_modules/**",
    "!**/jest.config.js",
    "!**/tests/*",
    "!**/coverage/**",
    "!**/src/app.js",
    "!**/src/api/routers.js"
  ]
};
