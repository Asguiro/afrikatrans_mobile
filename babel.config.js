module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // Zod 4 uses `export * as` — must run before transform-modules-commonjs in RN preset
  plugins: ['@babel/plugin-transform-export-namespace-from'],
};
