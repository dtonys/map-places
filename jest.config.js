// jest.config.js
module.exports = {
  // automock: false, //changes all requires to be references to mocks or undefined
  // bail: false, //stop running tests on first error
  collectCoverage: false, // report code coverage
  collectCoverageFrom: [ // Collect coverage from these files
    '**/*.js',
  ],
  verbose: true,
  moduleDirectories: [
    'node_modules',
    './client',
    './server',
    './common',
  ],
  //
  // moduleNameMapper: {
  //   '^image![a-zA-Z0-9$_-]+$': 'GlobalImageStub',
  //   '^[./a-zA-Z0-9$_-]+\\.png$': '<rootDir>/RelativeImageStub.js',
  //   'module_name_(.*)': '<rootDir>/substituted_module_$1.js',
  // },
  rootDir: './src',
  testEnvironment: 'node',
  testPathIgnorePatterns: [ '<rootDir>/.next/', '<rootDir>/node_modules/' ],
};
