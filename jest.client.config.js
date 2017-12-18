module.exports = {
  testEnvironment: 'jsdom',
  rootDir: './src/client',
  roots: [
    '<rootDir>',
    '<rootDir>/../../pages',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/../../.next/',
    '<rootDir>/../../node_modules/',
    'helpers',
  ],
  collectCoverage: false, // report code coverage
  collectCoverageFrom: [ // Collect coverage from these files
    '**/*.js',
  ],
  verbose: true,
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/../../jest-config/__mocks__/fileMock.js',
    // '\\.(css|scss|less)$': 'identity-obj-proxy', // NOTE: This would be required for local scope css
  },
  setupFiles: [
    '<rootDir>/../../jest-config/setupFiles.js',
  ],
  setupTestFrameworkScriptFile: '<rootDir>/../../jest-config/setupClientTests.js',
  snapshotSerializers: [
    'enzyme-to-json/serializer',
  ],
};
