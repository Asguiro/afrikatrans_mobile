const React = require('react');
const {View} = require('react-native');

const LottieView = React.forwardRef((props, _ref) =>
  React.createElement(View, {
    ...props,
    testID: props.testID || 'lottie-mock',
  }),
);
LottieView.displayName = 'LottieView';

module.exports = LottieView;
module.exports.default = LottieView;
