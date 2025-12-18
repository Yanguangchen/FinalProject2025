const React = require('react');

function LinearGradient(props) {
  // Render as a simple div for tests
  const { children, ...rest } = props || {};
  return React.createElement('div', { 'data-testid': 'linear-gradient', ...rest }, children);
}

module.exports = { LinearGradient };
module.exports.default = { LinearGradient };


