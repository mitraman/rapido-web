import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'
import PasswordConfig from '../passwordConfig.js'
import AlertContainer from 'react-alert'
import Backend from '../../adapter/Backend.js'

export default class extends React.Component{

  constructor(props) {
      super(props);
      this.state = {
        fullName: '',
        email: '',
        password: '',
        passwordConfirm: '',
        passwordConfig: PasswordConfig,
        errorMessages: {}
      };

      this.labels = {
        fullName: 'Name',
        email: 'Email',
        password: 'Password',
        passwordConfirm: 'Confirm Password'
      }

      this.alertOptions = {
        offset: 14,
        position: 'top right',
        theme: 'dark',
        time: 5000,
        transition: 'scale'
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  /* Component Initialisation */
  componentDidMount() {
    this.refs["password"].pattern = this.state.passwordConfig.passwordFields.pattern;
    this.refs["password"].minLength = this.state.passwordConfig.passwordFields.minLength;
    this.refs["password"].maxLength = this.state.passwordConfig.passwordFields.maxLength;
  }

  /* Method to show alert message */
  showAlert(message){
    console.log('showAlert');
    this.msg.error(message, {
      time: 5000,
      type: 'error',
      icon: <span className=""></span>
    });
  }

  /* Method to handle input change */
  handleChange(e) {

    e.target.classList.add('active');

    this.setState({
      [e.target.name]: e.target.value
    });


    let validityState = e.target.validity;

    let errorMessages = this.state.errorMessages;
    let label = this.labels[e.target.name];
    const isPassword = (e.target.name === 'password');
    const isPasswordConfirm = (e.target.name === 'passwordConfirm');

    if (isPasswordConfirm) {
      if( this.state.password !== e.target.value ) {
        e.setCustomValidity('Passwords do not match');
      } else {
        e.setCustomValidity('');
      }
    }

    //console.log('validityState: ', validityState)

    const passwordFields = this.state.passwordConfig.passwordFields;

    if( !validityState.valid ) {
      if (validityState.valueMissing) {
        errorMessages[e.target.name] = `${label} is a required field`;
      } else if (validityState.typeMismatch) {
        errorMessages[e.target.name] =  `${label} should be a valid email address`;
      } else if (isPassword && validityState.patternMismatch) {
        errorMessages[e.target.name] = `${label} should be between ${passwordFields.minLength}-${passwordFields.maxLength} characters`;
      } else if (isPassword && (validityState.tooShort || validityState.tooLong)) {
        errorMessages[e.target.name] =  `${label} should be between ${passwordFields.minLength}-${passwordFields.maxLength} characters`;
      } else if (isPasswordConfirm && validityState.customError) {
        errorMessages[e.target.name] = 'Passwords do not match';
      } else {
        console.warn('unexpected conformance validator problem: ', validityState);
        errorMessages[e.target.name] = `Invalid field value`;
      }
    } else if( validityState.valid ) {
        errorMessages[e.target.name] = null;
    }

    this.setState({'errorMessages': errorMessages})
    //this.showInputError(e.target.name);
  }

  /* Method to handle form submission */
  handleSubmit(e) {
    //console.log('handleSubmit for ', e);
    e.preventDefault();
    //console.log('component state', JSON.stringify(this.state));
    if (!this.showFormErrors()) {
      console.log('form is invalid: do not submit');
    } else {
      console.log('calling backend');
      Backend.register({
        "fullName": this.state.fullName,
        "nickName": "",
        "email": this.state.email,
        "password": this.state.password
      })
      .then((result)=> {
        console.log('got result ', result);
        browserHistory.push('/mailVerification');
      })
      .catch((error)=> {
        console.log('caught an error: ', error);
        this.showAlert(error)
      })

    }
  }

  /* Method to show Form Errors */
  showFormErrors() {
    const inputs = document.querySelectorAll('input');
    let isFormValid = true;

    inputs.forEach(input => {
      input.classList.add('active');

      const isInputValid = this.showInputError(input.name);

      if (!isInputValid) {
        isFormValid = false;
      }
    });

    return isFormValid;
  }

  /* Render Method */
  render() {
    let creationLabel;
    if (!this.props.fromDashboard) {
      creationLabel = <h3>Create an account</h3>
    }
    return(
      <div className="col-md-12">
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        <form id="registration" className="col-md-12 create-account-form" >
          {creationLabel}
          <div className="form-group">
            <label id="fullName">{this.labels.fullName}</label>
            <input className="form-control"
              type="text"
              name="fullName"
              ref="fullName"
              placeholder="First and Last Names"
              value={ this.state.fullName }
              onChange={ this.handleChange }
              required />
            <div className="error" id="fullNameError">{this.state.errorMessages.fullName}</div>
          </div>
          <div className="form-group">
            <label id="emailLabel">{this.labels.email}</label>
            <input className="form-control"
              type="email"
              name="email"
              ref="email"
              placeholder="email"
              value={ this.state.email }
              onChange={ this.handleChange }
              required />
            <div className="error" id="emailError">{this.state.errorMessages.email}</div>
          </div>
          <div className="form-group">
            <label id="passwordLabel">{this.labels.password}</label>
            <input className="form-control"
              type="password"
              name="password"
              ref="password"
              value={ this.state.password }
              onChange={ this.handleChange }
              required />
            <div className="error" id="passwordError">{this.state.errorMessages.password}</div>
          </div>
          <div className="form-group">
            <label id="passwordConfirmLabel">{this.labels.passwordConfirm}</label>
            <input className="form-control"
              type="password"
              name="passwordConfirm"
              ref="passwordConfirm"
              value={ this.state.passwordConfirm }
              onChange={ this.handleChange }
              required />
            <div className="error" id="passwordConfirmError">{this.state.errorMessages.passwordConfirm}</div>
          </div>
          <div className="registration-options">
            <button id="register" className="btn btn-default register-button"
            onClick={ this.handleSubmit }>Register</button>
          </div>
        </form>
      </div>
    )
  }
}
