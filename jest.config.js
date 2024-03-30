module.exports = {
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  collectCoverageFrom: ['**/*.service.ts', '**/*.controller.ts'],
  coveragePathIgnorePatterns: ['prisma.service.ts'],
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.env.js'],
};
