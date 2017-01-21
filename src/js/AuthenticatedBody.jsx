import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
  render() {
    return (

    <div>
      <ul>
      <li><Link to="/d3">D3</Link></li>
      <li><Link to="/ace">ACE editor sample</Link></li>
      </ul>
    </div>
    )
  }
})
