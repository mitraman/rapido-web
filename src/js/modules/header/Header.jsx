import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
const history = createHistory()

import LoginForm from '../login/LoginForm.jsx'
import Modal from '../Modal.jsx'
import '../../../css/header.scss'
import 'bootstrap/dist/js/bootstrap';

export default class extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    };
  }

  loginSucceeded() {
    $('#loginModal').modal('hide');
    this.setState({loggedIn: true});
  }

  render() {
    let authenticated = this.props.authenticated;

    let headerSection, loginSection, loginButton;

    headerSection = <div className="row header-login">
      <div className="col-md-4 pull-left">
        <h1 id="logo" className="app-title"><Link to="/home" id="logo" >Rápido</Link></h1>
      </div>
      <div className="col-md-4 pull-right">
        <h1>
          <button type="button" className="btn btn-default btn-lg" id="login" data-toggle="modal" data-target="#loginModal">Log In</button>
        </h1>
      </div>
    </div>

    let loginBody = <LoginForm loginSucceeded={ () => { this.loginSucceeded();} }  />


    if(this.state.loggedIn) {
      return (
        <Redirect push to="/projects"/>
      );
    }

    return (
      <div className="topnav">
        <Modal id="loginModal" title="Sign in" body={loginBody}/>
        {headerSection}
      </div>
    )
  }
}
