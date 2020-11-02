module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  testEnvironment: 'node',
  testMatch: ["**/__tests__/**/(*.)+test.ts?(x)"],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json'
    }
  }
}