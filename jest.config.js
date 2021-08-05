module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  testRegex: '((\\.|/)(test|spec))\\.(js|ts)$',
  moduleFileExtensions: ['ts', 'js'],
  modulePathIgnorePatterns: ['<rootDir>/__tests__/utils/*', '<rootDir>/build'],
  testPathIgnorePatterns: ['<rootDir>/__tests__/build'],
}
