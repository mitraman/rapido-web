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

    return (
      <div className="row header-login">
        <div className="col-md-4 pull-left">
          <h1 id="logo" className="app-title"><Link to="/home" id="logo" >Rápido</Link></h1>
        </div>
        {navButtons}
        <div className="col-md-4 pull-right">
        </div>
      </div>
    )
  }
})
