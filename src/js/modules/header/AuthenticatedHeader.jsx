import React from 'react';
import { Link } from 'react-router-dom';
import Backend from '../../adapter/Backend.js';
import fileDownload from 'react-file-download';
import '../../../css/header.scss'
import 'bootstrap/dist/js/bootstrap';

export default class extends React.Component{
  constructor(props) {
    super(props)
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

  exportOAPI2() {
    console.log('swagger export');
    // Make the call to do an export
    console.log(this.props.project);
    console.log(this.props.sketchIndex);
    let exportData =

    Backend.export(this.props.userInfo.token, this.props.project.id, this.props.sketchIndex, 'oai2')
    .then(exportData => {
      console.log(exportData);
      fileDownload(exportData, 'test.yaml');
    });

  }

  render() {
    let userName = this.props.userInfo.fullName;
    if( this.props.userInfo.nickName && this.props.userInfo.nickName.length > 0 ) {
      userName = this.props.userInfo.nickName;
    }

    let downloadMenu = '';
    if( this.props.sketchIndex > 0) {
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

    return (
      <div className="container-fluid">
        <div className="navbar navbar-default navbar-static-top">
          <Link className="navbar-left navbar-brand app-title" to="/home" id="logo" >Rápido</Link>
          <h3 className="navbar-text"><span className="label label-default">{this.props.project.name}</span></h3>
          {downloadMenu}

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
      </div>
    )
  }
}
