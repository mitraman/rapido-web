import React from 'react'
import { Link } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
const history = createHistory()

import '../../../css/header.scss'
import 'bootstrap/dist/js/bootstrap';



export default React.createClass({
  render() {

    let navButtons = <div className="h1 col-md-4 text-center"></div>
    if(this.props.showNavButtons) {
      navButtons = <div className="h1 col-md-4 text-center navigationButtons">
      <span><button type="button" className="topnav btn btn-default btn-lg"><i className="fa fa-book fa"></i></button></span>
      <span><button type="button" className="btn btn-default btn-lg topnav selected"><i className="fa fa-pencil fa fa-align-center"></i></button></span>
      <span><button type="button" className="topnav btn btn-default btn-lg"><i className="fa fa-share fa"></i></button></span>
    </div>;
    }

    let userName = this.props.userInfo.fullName;
    if( this.props.userInfo.nickName && this.props.userInfo.nickName.length > 0 ) {
      userName = this.props.userInfo.nickName;
    }

    return (
      <div className="row header-login">
        <div className="col-md-4 pull-left">
          <h1 id="logo" className="app-title"><Link to="/home" id="logo" >Rápido</Link></h1>
        </div>
        {navButtons}
        <div className="col-md-4 pull-right profilemenu">
          <div className="dropdown">
            <a  id="userProfileMenu"
              className="userProfile"
               data-target="#"
               data-toggle="dropdown"
               role="button" aria-haspopup="true" aria-expanded="false">{userName} <span className="caret"></span></a>
              <ul className="dropdown-menu" aria-labelledby="userProfileMenu">
                <li id="signout"><a href="#">Sign Out</a></li>
              </ul>
          </div>
        </div>
      </div>
    )
  }
})
