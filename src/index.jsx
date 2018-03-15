import injectCSS from './injectCSS';

import React, {Component, Children} from 'react';

import validators from './validators';
import formatters from './formatters';

import Reset from './Buttons/Reset';
import Submit from './Buttons/Submit';

import formElements from './Inputs';

const Recaptcha = formElements[formElements.length - 1];

const SYNTH = new Event('synthetic',
	{bubbles: false, cancelable: true}
);

class Form extends Component {
	constructor(props) {
		super(props);
		this.mapInputsToState = this.mapInputsToState.bind(this);
		this.addHandlersToChild = this.addHandlersToChild.bind(this);
		this.setCheckersForChild = this.setCheckersForChild.bind(this);
		this.renderChildren = this.renderChildren.bind(this);
		this.autoSubmit = this.autoSubmit.bind(this);

		this.onChange = this.onChange.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.recaptcha = this.recaptcha.bind(this);

		this.flagAllErrors = this.flagAllErrors.bind(this);
		this.onSubmit = this.onSubmit.bind(this);

		this.formatters = formatters;
		this.validators = validators;

		const initialState = { disabled: true, formData: {} };
		this.mapInputsToState(props.children, initialState);
		this.state = initialState;
	}

	mapInputsToState(children, initialState) {
		Children.map(children, child => {
			if (!child) return;
			else if (child.type === Recaptcha) {
				initialState.formData.recaptcha = false;
			}
			else if (child.type === 'fieldset') {
				this.mapInputsToState(child.props.children, initialState);
			}
			else if (formElements.includes(child.type)) {
				// discover the dataset object key
				let key = child.props.name || child.type.name;

				// set prevalidated for marked inputs; otherwise set an appropriate validator function
				if (child.props.required === false
				|| child.props.required === 'false') {
					this.validators[key] = this.validators.prevalidated;
				} else {
					this.setCheckersForChild(child, 'validators');
				}
				this.setCheckersForChild(child, 'formatters');

				// create initial state
				const target = {};
				target.value = child.props.defaultValue || '';
				target.checked = child.props.defaultValue || '';

				initialState.formData[key] = this.formatters[key](target);
			}
		});
	}

	setCheckersForChild(child, set) {
		let key = child.props.name || child.type.name;

		this[set][key] = child.props[set]			// custom checker
		|| this[set][key.toLowerCase()]				// checker by field name
		|| this[set][child.type.name.toLowerCase()]	// checker by type name
		|| this[set][child.props.type.toLowerCase()]// checker by type
		;
	}

	addHandlersToChild(child, idx) {
		if (formElements.includes(child.type)) {
			return React.cloneElement(child, {
				tabIndex: idx,
				onChange: child.type === Recaptcha
					? this.recaptcha
					: this.onChange,
				onBlur: this.onBlur,
				onFocus: this.onFocus,
				dataset: this.state.formData,
				required: child.required || true
			});
		}
		return child;
	}

	renderChildren() {
		let idx = 1;
		return Children.map(this.props.children, child => {
			if (!child) return;
			if (child.type === Submit) {
				return React.cloneElement(child, {
					disabled: this.state.disabled,
					flagAllErrors: this.flagAllErrors
				});
			}
			if (child.type === 'fieldset') {
				return (
					<fieldset>
						{Children.map(child.props.children, child => {
							return this.addHandlersToChild(child, idx++);
						})}
					</fieldset>
				);
			}
			if (formElements.includes(child.type)) {
				return this.addHandlersToChild(child, idx++);
			}
			return child;
		});
	}

	onChange(evt) {
		let key = evt.target.id;
		if (evt.target.type === 'radio') key = key.split('@@')[1];
		const formData = Object.assign({},
			this.state.formData,
			{[key]: this.formatters[key]
				? this.formatters[key](evt.target)
				: evt.target.value}
		);

		this.checkForm(formData);

		if (this.props.submitOnChange) this.autoSubmit();
	}

	// if left field with an error, flag it
	onBlur(evt) {
		const {formData} = this.state;
		const key = evt.target.id;
		const data = formData[key];

		if (this.validators[key]
		&& !this.validators[key](formData[key])) {
			evt.target.classList.add('error');
			evt.target.nextSibling.classList.add('error');
		}
	}

	// if focusing on an err'd field, clear the ErrorPage
	onFocus(evt) {
		evt.target.classList.remove('error');
		evt.target.nextSibling.classList.remove('error');
	}

	onSubmit(evt) {
		this.props.disabled
			? this.props.onSubmit.call(this, this.state.formData)
			: this.flagAllErrors()
		;
	}

	recaptcha(value) {
		const formData = Object.assign({},
			this.state.formData,
			{recaptcha: value}
		);

		this.checkForm(formData);
	}

	checkForm(formData) {
		let disabled = false;
		Object.keys(formData).forEach(key => {
			if (this.validators[key]
			&& !this.validators[key](formData[key])) {
				disabled = true;
			}
		});
		this.setState({ disabled, formData });
	}

	flagAllErrors() {
		if (!this.state.disabled) return;

		let el;
		Object.keys(this.state.formData).forEach(key => {
			el = document.getElementById(key);
			el.dispatchEvent(new Event('blur'));
		});
	}

	autoSubmit() {
		clearTimeout(this.submitTimeout);
		this.submitTimeout = setTimeout(() => {
			this.onSubmit(SYNTH);
		}, 2000);
	}

	componentWillUnmount() {
		if (this.submitTimeout) {
			clearTimeout(this.submitTimeout);
			this.onSubmit(SYNTH);
		}
	}

	render() {
		return (
			<form
				id={this.props.id}
				className={'formian-form '+this.props.className}
				onSubmit={this.onSubmit}
			>
				{this.renderChildren()}
			</form>
		);
	}
}

const Formian = formElements.reduce((formian, input) => {
	formian[input.name] = input;
	return formian;
}, { Form, Submit, Reset });

export default Formian;
