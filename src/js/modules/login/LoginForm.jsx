import React from 'react'
import ReactDOM from 'react-dom'
import AlertContainer from 'react-alert'
import LoginService from './LoginService.js';

export default class extends React.Component{

  constructor(props) {
      super(props);
      this.state = {
        email: '',
        password: '',
        rememberMe: false,
        errorMessages: {},
        formStarted: false,
        debug: 'empty'
      };

      // Keep the labels out of the state parameter becuase they aren't changed after being rendered.
      this.labels = {
        email: 'email address',
        password: 'password',
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

  /* Method to show alert message */
  showAlert(message){
    this.props.alertMsg.error(message, {
      time: 5000,
      type: 'error',
      icon: <span className=""></span>
    });
  }

  /* Method to handle input change */
  handleChange(e) {

    this.setState({formStarted: 'true'});
    e.target.classList.add('active');

    this.setState({
      [e.target.name]: e.target.value
    });

    this.showInputError(e.target);
  }


  /* Method to handle form submission */
  handleSubmit(e) {
  e.preventDefault();
    if( !this.state.formStarted ) {
      this.showAlert('Please fill out login form fields');
    } else if (Object.keys(this.state.errorMessages).length !== 0  ) {
      const thisForm = this;
      // Remind the user know that there are problems with the form
      Object.keys(this.state.errorMessages).forEach(function(key) {
        thisForm.showAlert(thisForm.state.errorMessages[key]);
      });
    } else {
      LoginService.login(this.state.email, this.state.password, this.state.rememberMe)
      .then( () => {
          this.props.loginSucceeded();
      }).catch( (error) => {
        console.log('ERROR:', error);
        this.showAlert(error)
      })
    }
  }

  showInputError(input) {
    let validityState = input.validity;

    let errorMessages = this.state.errorMessages;
    let label = this.labels[input.name];

    if( !validityState.valid ) {
      if (validityState.valueMissing) {
        errorMessages[input.name] = `Please enter your ${label}`;
      } else if (validityState.typeMismatch) {
        errorMessages[input.name] =  `Your ${label} doesn't look right.`;
      } else {
        console.warn('unexpected conformance validator problem: ', validityState);
        errorMessages[input.name] = `Invalid field value`;
      }
    } else if( validityState.valid ) {
        delete errorMessages[input.name];
    }
    this.setState({'errorMessages': errorMessages})
  }

  /* Render Method */
  render() {
    let creationLabel;
    if (!this.props.fromDashboard) {
      creationLabel = <h3>Create an account</h3>
    }
    return(
      <div>
        <form id="login-form" className="login-form" noValidate onSubmit={this.handleSubmit}>

          <div className="form-group">
            <label htmlFor="InputEmail" id="userEmailLabel">{this.labels.email}</label>
            <input
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
              className="form-control"
              id="InputEmail"
              name="email"
              ref="email"
              placeholder="Email" required
              required />
            <div className="error" id="userIdError">{this.state.errorMessages.email}</div>
          </div>

          <div className="form-group">
            <label htmlFor="InputPassword" id="passwordLabel">{this.labels.password}</label>
            <input
              type="password"
                value={this.state.password}
                onChange={this.handleChange}
                className="form-control"
                id="InputPassword"
                name="password"
                ref="password"
                placeholder="Password" required/>
              <div className="error" id="passwordError">{this.state.errorMessages.password}</div>
          </div>

          <div className="checkbox">
            <label>
              <input name="rememberMe" type="checkbox" value={this.state.rememberMe}/>
                Remember me
            </label>
          </div>

          <div className="input-group">
            <button type="submit" id="login-button" className="btn btn-primary pull-left">Sign In</button>
            <a id="forgotPassword" onClick={this.resetPassword}>Forgot Password?</a>
          </div>

        </form>
      </div>
    )
  }
}
