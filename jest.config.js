module.exports = {
  rootDir: './packages',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['../setupTests.js'],
  modulePathIgnorePatterns: ['build', 'node_modules'],
};
