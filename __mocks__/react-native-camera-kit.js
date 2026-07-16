// Native camera module — can't run under Jest, and ships no official mock (unlike
// @react-native-clipboard/clipboard). Stub the bits ScanCodeScreen actually uses.
const React = require('react');

module.exports = {
  Camera: React.forwardRef((_props, _ref) => null),
};
