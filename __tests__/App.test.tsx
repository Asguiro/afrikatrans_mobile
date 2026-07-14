/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('react-native-gesture-handler', () => {
  const {View} = require('react-native');
  return {
    GestureHandlerRootView: View,
  };
});

jest.mock('react-native-screens', () => {
  const Real = jest.requireActual('react-native-screens');
  return {
    ...Real,
    enableScreens: jest.fn(),
  };
});

test('renders AfrikaTrans root', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(<App />);
    await Promise.resolve();
  });
  expect(tree).toBeTruthy();
});
