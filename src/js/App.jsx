import React from 'react';
import AuthenticatedBody from './AuthenticatedBody';
import Header from './Header';

import 'bootstrap/dist/css/bootstrap.css';



export default React.createClass({
  render() {
    let authState = "authenticated";
    let body = <div>Guest Content</div>
    let header = <Header authenticated={false}/>
    if( authState == "authenticated") {
      header = <Header authenticated={true}/>
      body = <AuthenticatedBody/>
    }

    return (
      <div className ="container">
      	{header}
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
