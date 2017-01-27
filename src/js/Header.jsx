import React from 'react'

import '../css/nav.css'

export default React.createClass({
  render() {
    return (
      <div className="row">
        <div className="col-md-4 pull-left">
          <h4>Rapido</h4>
          <h2>My API Project</h2>
          <h3>Iteration 3</h3>
        </div>
        <div className="h1 col-md-4 text-center">
          <span><button type="button" className="btn btn-default btn-lg topnav"><i className="fa fa-book fa"></i></button></span>
          <span><button type="button" className="btn btn-default btn-lg topnav selected"><i className="fa fa-pencil fa fa-align-center"></i></button></span>
          <span><button type="button" className="topnav btn btn-default btn-lg"><i className="fa fa-share fa"></i></button></span>
        </div>
        <div className="h1 col-md-1 col-md-offset-3 pull-right">
          <span><button type="button" className="btn btn-default btn-lg"><i className="glyphicon glyphicon-user"></i></button></span>
          <span className="lead"><small>Ronnie</small></span>
        </div>
      </div>
    )
  }
})
