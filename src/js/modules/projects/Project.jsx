import React from 'react'
import AlertContainer from 'react-alert';
import Backend from '../../adapter/Backend.js';
import Sketch from '../Sketch.jsx'
import ErrorCodes from '../error/codes.js';
import { Route, Redirect } from 'react-router-dom'

import '../../../css/folding-cube.scss'

export default class extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      sketches: [],
      projectNotFound: false
    }
    console.log('this.loadProject');
    this.loadProject(this.props.userObject.token, this.props.projectId);
  }

  componentWillReceiveProps(nextProps) {
    console.log('project:componentWillReceiveProps');
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
      this.props.setSketchIndexHandler(1);
    }).catch( e => {
      console.log('a problem occurred while loading the project:');
      console.log(e);
      if( e.type === 'http://rapidodesigner.com/api/problems/general' &&
        e.code === ErrorCodes.projectNotFound) {
          //TODO: How should we alert the user that a project was not found?
          this.setState({projectNotFound: true});
      }else if( e.code === ErrorCodes.userNotFound ||
         e.code === ErrorCodes.authenticationProblem ) {
        this.props.authErrorHandler(e);
      }else {
        console.log('unhandled error:', e);
      }
    })
  }

  /* Render Method */
  render() {
    if( this.state.projectNotFound ) {
      return(
        <Redirect to="/"/>
      )
    }
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
