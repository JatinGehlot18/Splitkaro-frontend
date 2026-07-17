const preset = require('@react-native/jest-preset');

module.exports = {
  preset: '@react-native/jest-preset',
  // Preset only merges non-array keys; setupFiles/transformIgnorePatterns must be re-declared in full.
  setupFiles: [...preset.setupFiles, './jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community|-async-storage|-google-signin)?|@react-navigation|react-native-camera-kit|react-native-qrcode-svg|react-native-svg|react-native-safe-area-context|react-native-screens)/)',
  ],
};
