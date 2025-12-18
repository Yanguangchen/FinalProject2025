/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  setupFilesAfterEnv: ['@testing-library/jest-dom', '<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^@react-native-community/netinfo$': '<rootDir>/__mocks__/@react-native-community/netinfo.js',
    '^expo-linear-gradient$': '<rootDir>/__mocks__/expo-linear-gradient.js',
    '^@expo/vector-icons/Ionicons$': '<rootDir>/__mocks__/@expo/vector-icons/Ionicons.js',
    '\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(png|jpg|jpeg|gif|svg|webp|ttf|woff|woff2)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|react-native-web|@react-native|@react-navigation|react-native-screens|react-native-safe-area-context|expo|expo-.*|@expo/.*)/)',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'screens/**/*.js',
    'UI/**/*.js',
    'context/**/*.js',
    'App.js',
    '!**/__tests__/**',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__mocks__/',
  ],
};


