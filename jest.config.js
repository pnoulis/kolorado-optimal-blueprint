/** @type {import('jest').Config} */

export default {
  // https://jestjs.io/docs/configuration#testtimeout-number
  testTimeout: 30000,
  // https://jestjs.io/docs/configuration#clearmocks-boolean
  clearMocks: true,
  // https://jestjs.io/docs/configuration#testenvironment-string
  testEnvironment: "node",
  // https://jestjs.io/docs/configuration#testmatch-arraystring
  testMatch: ["**/*.test.js"],
  // https://jestjs.io/docs/configuration#globalsetup-string
  globalSetup: "./jest.setup.js",
  // https://jestjs.io/docs/ecmascript-modules
  transform: {},
};
