module.exports = {
  verbose: true,
  testEnvironment: "node",
  moduleNameMapper: {
    "logging.service": "<rootDir>/src/__mocks__/logging.service.js"
  },
  reporters: [
    "default",
    ["jest-junit", { output: `./reports/TEST-${process.env.TEST_TYPE}.xml` }]
  ],
  coverageReporters: ["cobertura", "lcov", "json", "text"],
  collectCoverageFrom: [
    "**/*.{js}",
    "!**/node_modules/**",
    "!**/jest.config.js",
    "!**/scripts/*",
    "!**/tests/*",
    "!**/coverage/**",
    "!**/src/app.js",
    "!**/src/api/routers.js",
    "!**/src/db/**",
    "!**/src/connectors/**/*.double.js",
    "!**/src/api/**/*.router.js",
    "!**/tests/**/*.js"
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: -10
    }
  }
};
