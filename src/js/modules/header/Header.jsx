import React from 'react'
import { Link } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
const history = createHistory()

import LoginForm from '../login/LoginForm.jsx'
import Modal from '../Modal.jsx'
import '../../../css/header.scss'
import 'bootstrap/dist/js/bootstrap';

export default React.createClass({
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

    let loginSucceeded = function() {
      history.push('/projects');
    }
    let loginBody = <LoginForm loginSucceeded={loginSucceeded}/>

    return (
      <div className="topnav">
        <Modal id="loginModal" title="login" body={loginBody}/>
        {headerSection}
      </div>
    )
  }
})
