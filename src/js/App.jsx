import React from 'react';
import AuthenticatedBody from './AuthenticatedBody';
import Header from './Header';

import 'bootstrap/dist/css/bootstrap.css';
import '../css/app.css'

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
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
})
