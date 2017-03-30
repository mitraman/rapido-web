import React from 'react'
import { Link } from 'react-router'

import '../../../css/header.scss'


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
            <Link to="/login">
              <button className="btn btn-default btn-lg" id="login">Log In</button>
            </Link>
          </h1>
        </div>
      </div>

    }else if (authenticated) {
        headerSection = <div>authenticated</div>
    }

    return (
      <div >
        {headerSection}
      </div>
    )
  }
})
