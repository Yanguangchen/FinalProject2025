const React = require('react');

function Ionicons(props) {
  const { name = 'ionicon', size = 16, color = 'currentColor', ...rest } = props || {};
  return React.createElement('span', { 'data-testid': 'ionicon', 'data-name': name, style: { fontSize: size, color }, ...rest });
}

module.exports = Ionicons;
module.exports.default = Ionicons;


