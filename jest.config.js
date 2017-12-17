// jest.config.js
module.exports = {
  // automock: false, //changes all requires to be references to mocks or undefined
  // bail: false, //stop running tests on first error
  testEnvironment: 'node',
  rootDir: './src',
  roots: [
    '<rootDir>',
    '<rootDir>/../pages',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/../.next/',
    '<rootDir>/../node_modules/',
    'helpers',
  ],
  collectCoverage: false, // report code coverage
  collectCoverageFrom: [ // Collect coverage from these files
    '**/*.js',
  ],
  verbose: true,
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    // '\\.(css|scss|less)$': 'identity-obj-proxy', // NOTE: This would be required for local scope css
  },
  moduleDirectories: [
    'node_modules',
    './client',
    './server',
    './common',
  ],
  setupTestFrameworkScriptFile: '<rootDir>/setupTests.js',
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],
};
