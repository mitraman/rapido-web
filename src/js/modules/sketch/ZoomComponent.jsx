import React from 'react'

import '../../../css/sketch.scss'

export default class extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      magnification: 1.0
    }
  }

  onZoomOut() {
    let newMagnification = this.state.magnification - 0.2;
    this.setState(magnification: newMagnification);
    this.props.zoomHandler(newMagnification);
  }

  onZoomIn() {

  }

  onSetZoomFactor() {

  }

  render() {
    return(
      <div>
        <div onClick={e=>onZoomIn}><i className="fa fa-search-plus fa-2x" aria-hidden="true"></i></div>
        <div>magnification</div>
        <div onClick={e=>onZoomOut}><i className="fa fa-search-minus fa-2x" aria-hidden="true"></i></div></div>
    )
  }
}
