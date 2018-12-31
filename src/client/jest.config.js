module.exports = {
  "roots": [
    "<rootDir>"
  ],
  "setupTestFrameworkScriptFile": "<rootDir>/setupEnzyme.ts",
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "testRegex": "((\\.|/)(test|spec))\\.tsx?$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js"
  ],
}