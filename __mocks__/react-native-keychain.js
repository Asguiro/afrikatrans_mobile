module.exports = {
  setGenericPassword: jest.fn(() => Promise.resolve(true)),
  getGenericPassword: jest.fn(() => Promise.resolve(false)),
  resetGenericPassword: jest.fn(() => Promise.resolve(true)),
  hasGenericPassword: jest.fn(() => Promise.resolve(false)),
  getSupportedBiometryType: jest.fn(() => Promise.resolve(null)),
  ACCESSIBLE: {
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'AccessibleWhenUnlockedThisDeviceOnly',
  },
  ACCESS_CONTROL: {
    BIOMETRY_CURRENT_SET: 'BiometryCurrentSet',
    BIOMETRY_ANY: 'BiometryAny',
  },
};
