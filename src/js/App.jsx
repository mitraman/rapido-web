import React from 'react';
import AuthenticatedBody from './AuthenticatedBody';
import Header from './Header';
import Login from './LoginComponent'

import 'bootstrap/dist/css/bootstrap.css';
import '../css/app.css'

function loginHandler(params) {
  console.log(params);
}

export default React.createClass({
  render() {
    let authState = "authenticated";
    let body = <div>Guest Content</div>
    let header = <Header authenticated={false}/>
    if( authState == "authenticated") {
      header = <Header authenticated={true}/>
    }

    return (
      <div className ="container">
      	{header}
        <div className="row">
          <div className="col-md-12">
            <Login onSubmit={loginHandler}/>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
})
