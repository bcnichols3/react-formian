'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Input = require('../../common/Input');

var _Input2 = _interopRequireDefault(_Input);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Email = function Email(props) {
	return _react2.default.createElement(_Input2.default, _extends({ type: 'email' }, props, { className: props.className }));
};

Email.defaultProps = {
	type: "email",
	name: "email",
	defaultValue: "",
	className: "",
	autoComplete: "email",
	errorText: "Please enter a valid email address"
};

exports.default = Email;