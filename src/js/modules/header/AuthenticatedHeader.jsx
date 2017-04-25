import React from 'react'
import { Link } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
const history = createHistory()

import '../../../css/header.scss'
import 'bootstrap/dist/js/bootstrap';



export default React.createClass({
  render() {
    let headerSection;

      headerSection = <div className="row header-login">
        <div className="col-md-4 pull-left">
          <h1 id="logo" className="app-title"><Link to="/home" id="logo" >Rápido</Link></h1>
        </div>
        <div className="col-md-4 pull-right">
        </div>
      </div>


    return (
      <div >
        {headerSection}
      </div>
    )
  }
})
