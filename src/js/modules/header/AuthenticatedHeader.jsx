import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Backend from '../../adapter/Backend.js';
import fileDownload from 'react-file-download';
import '../../../css/header.scss'
import 'bootstrap/dist/js/bootstrap';
import Modal from '../Modal.jsx'


export default class extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      routeExport: false
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

  // exportOAPI2() {
  //   // Make the call to do an export
  //   //console.log(this.props.project);
  //   //console.log(this.props.sketchIndex);
  //   let exportData =
  //
  //   Backend.export(this.props.userInfo.token, this.props.project.id, this.props.sketchIndex, 'oai2')
  //   .then(exportData => {
  //     //console.log(exportData);
  //     let filename = this.props.project.name + '.yaml';
  //     fileDownload(exportData, filename);
  //   });
  //
  // }

  export() {
    //console.log('export clicked');
    this.setState({routeExport: true});
  }

  render() {
    let userName = this.props.userInfo.fullName;
    if( this.props.userInfo.nickName && this.props.userInfo.nickName.length > 0 ) {
      userName = this.props.userInfo.nickName;
    }

    let downloadMenu = '';
    let exportButton = '';
    if( this.props.sketchIndex > 0) {
      exportButton = <button type="button" className="btn btn-default" id="export" onClick={(e)=>{this.export(e)}}>Export</button>
      downloadMenu = <ul className="nav navbar-nav">
        <li className="dropdown">
          <a id="downloadMenu"
            className="navbar-link"
            data-target="#"
            data-toggle="dropdown"
            role="button"  aria-haspopup="true" aria-expanded="false">Download <i className="fa fa-file-text" aria-hidden="true"></i></a>
            <ul className="dropdown-menu" aria-labelledby="userProfileMenu">
              <li id="signout"><a href="#" onClick={() => this.exportOAPI2()}>Open API Specification 2.0</a></li>
            </ul>
        </li>
      </ul>;
    }

    if(this.state.routeExport) {
      let url = '/project/' + this.props.project.id + '/sketch/' + this.props.sketchIndex + '/export';
      return <Redirect push to={url}/>;
    }

    let alertBar = '';
    if( !this.props.userInfo.isVerified) {
      alertBar = <div className="row">
        <div className="col-md-12 alert-warning alert-bar" role="alert"><p><strong>You won't be able to create a new project until you follow the verification link we sent you at {this.props.userInfo.email}</strong></p>
        <a href="#" className="alert-link">If you are having trouble, we can send you another verification email.</a></div>
      </div>
    }
    return (
      <div className="container-fluid">
        <div className="navbar navbar-default navbar-static-top">
          <Link className="navbar-left navbar-brand app-title" to="/home" id="logo" >Rápido</Link>
          <h3 className="navbar-text"><span className="label label-default">{this.props.project.name}</span></h3>
          {exportButton}

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
      </div>
    )
  }
}
