import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
  render() {
    return (
    <div>
      <ul>
      <li><Link to="/nodes">Sketch</Link></li>
      </ul>
    </div>
    )
  }
})
