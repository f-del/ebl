const { defaults } = require("jest-config");
module.exports = {
  setupFilesAfterEnv: ["<rootDir>testssetupTests.js"],
  collectCoverage: true
};
