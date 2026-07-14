module.exports = {
  preset: '@react-native/jest-preset',
  watchman: false,
  moduleNameMapper: {
    '^react-native-keychain$': '<rootDir>/__mocks__/react-native-keychain.js',
    '^@react-native-community/netinfo$': '<rootDir>/__mocks__/netinfo.js',
    '^lucide-react-native$': '<rootDir>/__mocks__/lucide-react-native.js',
    '^lottie-react-native$': '<rootDir>/__mocks__/lottie-react-native.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|react-native-svg|react-native-keychain|lottie-react-native|@react-native-community|@tanstack)/)',
  ],
};
