import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom'
import Header from './header/Header';
import AuthenticatedHeader from './header/AuthenticatedHeader';
import LoginComponent from './login/LoginComponent.jsx';
import VerifyComponent from './register/VerifyComponent.jsx';
import Landing from './Landing.jsx';
import AuthenticatedApp from './AuthenticatedApp';

import 'bootstrap/dist/css/bootstrap.css';
import '../../css/app.scss'
import '../../css/github-corners.scss'

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userObject : {},
      showNavButtons : false,
      activeProject : 0
    }
  }

  parseAuthToken() {
    // Check in local storage for the auth token (this happens if the user clicks 'remember me')
    let userObject = {};
    try {
      userObject = JSON.parse(localStorage.getItem('userInfo'));
      if( !userObject ) {
        // Otherwise, check if the token is in session storage
         userObject = JSON.parse(sessionStorage.getItem('userInfo'));
      }
      // If there is no userObject, make it empty
      userObject = (userObject) ? userObject : {};
    } catch( e ) {
      console.error('Unable to parse login information:', e);
    }

    return userObject;
  }

  componentDidMount() {
  }

  render() {

    let header, bodyContent;

    // Set the default authentication state
    let authenticated = false;

    let userObject = this.parseAuthToken();
    // If we have an auth token, change the auth state and header
    if(userObject.token) {
      // Use an authenticated header if we have an auth token
      header = <AuthenticatedHeader userInfo={userObject} showNavButtons={this.state.showNavButtons}/>;
      authenticated = true;
    }

    // Setup the body
    if( authenticated ) {
      return (
        <div id="root">
          <AuthenticatedApp userObject={userObject} />
        </div>
      )
    }else  {
      return (
        <Switch>
          <Route path="/verify" component={VerifyComponent}/>
          <Route path="/login" component={LoginComponent}/>
          <Route component={Landing}/>
        </Switch>
      );
    }
  }

}
