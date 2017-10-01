import React from 'react'
import RegistrationForm from './register/RegistrationForm'
import AlertContainer from 'react-alert';
import LoginService from './login/LoginService';
import Header from './header/Header';
import { Route, Redirect } from 'react-router-dom'


export default class extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      alertBox: {
        error: (message) => {
          this.msg.error(message);
        }
      }
    }
    this.alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    };
  }

  /* Render Method */
  render() {
    let registered =  (registeredUser) => {
      // The user has been succesfully registered, try to automatically login
      LoginService.login(registeredUser.email, registeredUser.password)
      .then( () => {
        // Redirect to the projects page
        this.setState({loggedIn: true});
      } )
      .catch( (error) => {
        console.error('error:' + error);
        //TODO: what do we do if registration suceeded, but login failed?
      })
    }

    // Link to the github repo for the frontend code, displayed as a badge in the top, right corner on the landing page
    let githubBadge =   <div className="github-corner-badge">
      <a href="https://github.com/apiacademy/rapido-web" className="github-corner" aria-label="View source on Github">
      <svg width="80" height="80" viewBox="0 0 250 250" className="github-svg" aria-hidden="true">
        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
        <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="white" className="octo-arm github-svg-path"></path>
        <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="white" className="octo-body"></path>
      </svg>
      </a>
    </div>

    if(this.state.loggedIn) {
      return(
          <Redirect push to="/projects"/>
      )
    }

    return(
      <div id="landing">
        <Header/>
        <div className="container-fluid">
        <div className="row">
          <AlertContainer ref={(a) => this.msg = a} {...this.alertOptions} />
          <div className="col-md-8">
            <div className="banner"><h2>Discover your best API design faster.</h2></div>
            <div className="copy">
              <p>Rapido is an <a href="http://www.apiacademy.co">API Academy tool</a> that lets your rapidly <i>sketch</i> an API design.</p>
          </div>
          </div>
          <div className="col-md-4 registration-section">
            <RegistrationForm alertBox={this.state.alertBox} registrationSuceeded={registered} />
          </div>
        </div>
        <div className="row">
        </div>
        </div>
      </div>
    )
  }
}
