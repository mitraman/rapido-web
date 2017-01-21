import React from 'react'
import AuthenticatedBody from './AuthenticatedBody'

import 'bootstrap/dist/css/bootstrap.css'


export default React.createClass({
  render() {
    let authState = "authenticated";
    let body = <div>Guest Content</div>
    if( authState == "authenticated") {
      body = <AuthenticatedBody/>
    }

    return (
      <div className ="container">
      	<div className="row">
      	   <div className="col-md-12">
             <h1>Rapido</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            {body}
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
})
