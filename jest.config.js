module.exports = {
  verbose: true,
  testEnvironment: "node",
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
