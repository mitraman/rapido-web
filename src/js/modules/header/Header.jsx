import React from 'react'
import { Link } from 'react-router'

import Modal from '../Modal.jsx'
import LoginForm from '../login/LoginForm.jsx'
import '../../../css/header.scss'
import 'bootstrap/dist/js/bootstrap';



export default React.createClass({
  render() {
    let authenticated = this.props.authenticated;

    let headerSection, loginSection, loginButton;

    if( !authenticated ) {

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

    }else if (authenticated) {
        headerSection = <div>authenticated</div>
    }

    let loginBody = <LoginForm/>
    
    return (
      <div >
        <Modal id="loginModal" title="login" body={loginBody}/>
        {headerSection}
      </div>
    )
  }
})
