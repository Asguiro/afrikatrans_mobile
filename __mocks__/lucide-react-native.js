const React = require('react');

function Icon() {
  return React.createElement('Icon');
}

module.exports = new Proxy(
  {},
  {
    get: () => Icon,
  },
);
