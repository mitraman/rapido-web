import React from 'react'
import AlertContainer from 'react-alert';
import AuthenticatedHeader from './header/AuthenticatedHeader';
import ProjectSelection from './projects/ProjectSelection';
import Project from './projects/Project';
import Sketch from './Sketch';
import { Route, Redirect, Switch } from 'react-router-dom'


export default class extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      project: {},
      sketchId: 0,
      authenticationError: false
    }
  }

  setProject(project) {
    this.setState({project: project});
  }

  setSketchIndex(sketchId) {
    this.setState({sketchId: sketchId});
  }

  authErrorHandler(error) {
    console.log('authErrorHandler');
    console.log(error);
    this.setState({authenticationError: true})
  }

  /* Render Method */
  render() {

    if( this.state.authenticationError ) {
      return(
        <div>
          <AuthenticatedHeader project={this.state.project} userInfo={this.props.userObject} sketchIndex={this.state.sketchId}/>
          <div className="row">
            <div className="alert alert-danger">There is a problem with your user credentais.  Try signing out and loging in again.</div>
          </div>
        </div>
      );
    }else {
      return(
        <div id="authenticated">
          <AuthenticatedHeader project={this.state.project} userInfo={this.props.userObject} sketchIndex={this.state.sketchId}/>
          <div className="row">
            <AlertContainer ref={(a) => this.msg = a} {...this.alertOptions} />
            <Switch>
              <Route path="/project/:projectId" render={(routeProps) => {
                  return <Project projectId={routeProps.match.params.projectId}
                    userObject={this.props.userObject}
                    authErrorHandler={error => this.authErrorHandler(error)}
                    setProjectHandler={project => {this.setProject(project)}}
                    setSketchIndexHandler={sketchIndex => {this.setSketchIndex(sketchIndex)}}/>
                }}/>
              <Route render={(routeProps) => {
                  return <ProjectSelection
                    match={routeProps.match}
                    authErrorHandler={error => this.authErrorHandler(error)}
                    userObject={this.props.userObject}/>}} />
            </Switch>
          </div>
        </div>
      );
    }
  }
}
