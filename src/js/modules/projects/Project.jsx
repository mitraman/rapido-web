import React from 'react'
import AlertContainer from 'react-alert';
import Backend from '../../adapter/Backend.js';
import Sketch from '../Sketch.jsx'
import { Route, Redirect } from 'react-router-dom'

import '../../../css/folding-cube.scss'

export default class extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      sketches: []
    }
    this.loadProject(this.props.userObject.token, this.props.projectId);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.projectId != this.props.projectId) {
      this.loadProject(this.props.userObject.token, this.props.projectId);
    }
  }

  loadProject(token, projectId) {
    Backend.getProject(token, projectId)
    .then((result)=>{
      // Use the first sketch iteration by default
      if( !result.project.sketches ){
        throw new Error('No Sketch iterations found in this project');
      }

      this.setState({sketches: result.project.sketches});
      this.props.setProjectHandler(result.project);
    })
  }

  /* Render Method */
  render() {
    if( this.state.sketches.length > 0 ) {
      return(
        <Route path="/project/:projectId/sketch/:sketchIteration" render={(routeProps) => {
            return <Sketch
              sketches={this.state.sketches}
              projectId={routeProps.match.params.projectId}
              sketchIteration={routeProps.match.params.sketchIteration}
              userObject={this.props.userObject}/> }} />
      )
    }else {
      let centreStyle = {textAlign: 'center'};
      return(
        <div>
          <p style={centreStyle}>Loading Sketches...</p>
          <div className="sk-folding-cube">
          <div className="sk-cube1 sk-cube"></div>
          <div className="sk-cube2 sk-cube"></div>
          <div className="sk-cube4 sk-cube"></div>
          <div className="sk-cube3 sk-cube"></div>
          </div>
        </div>)
    }
  }
}
