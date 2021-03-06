'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Container = require('./Container');

var _Container2 = _interopRequireDefault(_Container);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Fieldset = function Fieldset(_ref) {
	var name = _ref.name,
	    type = _ref.type,
	    labelText = _ref.labelText,
	    style = _ref.style,
	    className = _ref.className,
	    position = _ref.position,
	    children = _ref.children;
	return _react2.default.createElement(
		'fieldset',
		{ id: name, name: name, className: 'fieldset-' + className },
		labelText || name ? _react2.default.createElement(
			'legend',
			null,
			labelText || name
		) : null,
		_react2.default.createElement(
			_Container2.default,
			{ type: type, className: className, style: style },
			children
		)
	);
};

Fieldset.defaultProps = {
	type: "fieldset",
	className: ""
};

exports.default = Fieldset;