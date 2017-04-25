import React from 'react'
import ReactDOM from 'react-dom'
import AlertContainer from 'react-alert'
import Backend from '../../adapter/Backend.js'

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
        email: 'User ID',
        password: 'Password',
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
      Backend.login({
        "email": this.state.email,
        "password": this.state.password
      })
      .then((result)=> {
        //console.log(result);
        // Store the token based on the login parameters
        let userInfo = JSON.stringify({
          userId: result.userId,
          email: this.state.email,
          fullName: result.fullName,
          token: result.token,
          nickName: result.nickName
        });

        if( this.state.rememberMe ) {
          localStorage.setItem('userInfo', userInfo );
        }else {
          sessionStorage.setItem('userInfo', userInfo );
        }
        this.props.loginSucceeded();
      })
      .catch((error)=> {
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
        errorMessages[input.name] = `${label} is a required field`;
      } else if (validityState.typeMismatch) {
        errorMessages[input.name] =  `${label} should be a valid email address`;
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
              placeholder="email address" required
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
                pattern=".{5,}"
                placeholder="Password" required/>
              <div className="error" id="passwordError">{this.state.errorMessages.password}</div>
          </div>

          <div className="checkbox">
            <label>
              <input name="rememberMe" type="checkbox" value={this.state.rememberMe}/>
                Remember me
            </label>
          </div>

          <div className="form-group forgot-password">
              <a id="forgotPassword" onClick={this.resetPassword}>Forgot Password?</a>
          </div>

          <div className="form-group account-options">
              <button type="submit" id="login-button" className="btn btn-default pull-left">Login</button>
              <a className="create-label pull-right" onClick={this.register}>Create an account</a>
          </div>

        </form>
      </div>
    )
  }
}
