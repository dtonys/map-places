module.exports = {
  testEnvironment: 'node',
  rootDir: './src/server',
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
};
