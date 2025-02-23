module.exports = {
  transform: {
    "^.+\.(t|j)sx?$": "@swc/jest",
  },
  testRegex: ".*\\.e2e\\.spec\\.ts$",
  moduleFileExtensions: ["js", "json", "ts"],
  testEnvironment: "node",
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
}; 