import React from 'react'
import ReactDOM from 'react-dom'
import queryString from 'query-string'
import Backend from '../../adapter/Backend.js';
import LoginService from '../login/LoginService.js';
import RapidoErrorCodes from '../error/codes.js';
import { Route, Redirect } from 'react-router-dom'

export default class extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      verificationPassed: false,
      verificationFailed: true,
      errorCode: '',
      redirectToLanding: false
    }
  }

  verify() {
    // Get verification code from URI
    let queryObject = queryString.parse(this.props.location.search);
    let code = queryObject.code;
    if( code ) {
      // Make verification call
      Backend.verify(code)
      .then( result => {
        //console.log(result);
        // If all went well, we should have a token to use for authentication
        LoginService.storeUserInfo(
          result.userId,
          result.email,
          result.fullName,
          result.token,
          result.nickName,
          result.isVerified);

        // Redirect to the project page
        this.setState({verificationPassed: true});
      }).catch( error => {
        //console.log(error);
        if( error.code === RapidoErrorCodes.invalidVerificationToken) {
          this.setState({errorCode: error.code});
        }
        this.setState({verificationFailed: true});
      })
    }else {
      // Redirect to the landing page
      //console.log('no code query param found');
      this.setState({redirectToLanding: true});
    }
  }

  componentDidMount() {
    //console.log('VerifyComponent - componentDidMount');
    this.verify();
  }

  // componentDidUpdate() {
  //   console.log('VerifyComponent - componentDidUpdate');
  //   this.verify();
  // }

  render() {

    // TODO: What if the user is authenticated?

    if( this.state.redirectToLanding) {
      return(<Redirect push to="/"/>)
    }else if( this.state.verificationPassed) {
      return(<Redirect push to="/projects"/>)
    }else if( this.state.verificationFailed){
      return(<div>Sorry, something went wrong with the verification process.</div>)
      //TODO: Figure out how to pass an error message to the target component
      /*
      const location = {
        pathname: '/',
        state: {
          fromVerify: true,
          errorCode: this.state.errorCode
        }
      }
      return(<Redirect push to={location}/>)
      */
    }
    return (<div></div>)
  }
}
