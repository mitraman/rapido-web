import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Backend from '../../adapter/Backend.js';
import '../../../css/header.scss'
import 'bootstrap/dist/js/bootstrap';
import Modal from '../Modal.jsx'
import RapidoErrorCodes from '../error/codes.js';
import LoginService from '../login/LoginService.js';
import SketchHeader from './SketchHeader.jsx';


export default class extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      resultModalTitle: '',
      resultModalBody: ''
    }
  }

  logout() {
    // Remove the login token
    try {
      localStorage.removeItem('userInfo');
      sessionStorage.removeItem('userInfo');
    } catch (e) {
      console.log(e);
    }
  }

  sendVerification() {
    // Ask the server to send another verification email
    Backend.sendCode(this.props.userInfo.email)
    .then( result => {
      this.setState({resultModalTitle: 'Email Sent!'})
      this.setState({resultModalBody: 'We just sent you an email.  To verify your account, just click on the link inside of the email.'})
      $('#resultModal').modal('show');
    }).catch( e => {
      if( e.code === RapidoErrorCodes.alreadyVerified ) {
        this.setState({resultModalTitle: 'No Need!'})
        this.setState({resultModalBody: 'It looks like you are already verified.  If you reload this page in your browser you should be good to go.'})
        LoginService.setVerified(true);
        $('#resultModal').modal('show');
      }else {
        this.setState({resultModalTitle: 'Uh Oh!'})
        this.setState({resultModalBody: 'We had a problem sending you a verification email.  You can try again later, but if the problem persists, let us know.'})
        $('#resultModal').modal('show');
      }
    })
    // Popup a modal to report the result
  }


  //TODO: Use a componant for the result modal
  render() {

    let userName = this.props.userInfo.fullName;
    if( this.props.userInfo.nickName && this.props.userInfo.nickName.length > 0 ) {
      userName = this.props.userInfo.nickName;
    }

    let alertBar = '';
    if( !this.props.userInfo.isVerified) {
      alertBar = <div className="row">
        <div className="col-md-12 alert-warning alert-bar" role="alert">
          <div className="row">
            <div className="col-md-10">
              <p><strong>You won't be able to create a new project until you follow the verification link we sent you at {this.props.userInfo.email}</strong></p>
            </div>
            <div className="col-md-2 pull-right">
              <button type="button" className="btn btn-primary" onClick={(e)=>{this.sendVerification(e)}}>Send Another Verification Email</button>
            </div>
          </div>
        </div>
      </div>
    }

    let sketchHeader = '';
    if( this.props.project ) {
      sketchHeader = <SketchHeader {...this.props}/>
    }
    return (
      <div className="container-fluid">
        <div className="navbar navbar-default navbar-static-top">
          <Link className="navbar-left navbar-brand app-title" to="/home" id="logo" >Rápido</Link>
          {sketchHeader}
          <ul className="nav navbar-nav navbar-right">
            <li className="dropdown">
          <a id="userProfileMenu"
            className="navbar-link userProfile"
            data-target="#"
            data-toggle="dropdown"
            role="button" aria-haspopup="true" aria-expanded="false">{userName} <span className="caret"></span></a>
            <ul className="dropdown-menu" aria-labelledby="userProfileMenu">
              <li id="signout"><a href="#" onClick={this.logout}>Sign Out</a></li>
            </ul>
            </li>
          </ul>
        </div>

        {alertBar}

        <div id="resultModal" className="modal fade" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4>{this.state.resultModalTitle}</h4>
            </div>
              <div className="modal-body">
                {this.state.resultModalBody}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
