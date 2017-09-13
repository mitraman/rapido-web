import React from 'react'
import AlertContainer from 'react-alert';
import AuthenticatedHeader from './header/AuthenticatedHeader';
import ProjectSelection from './projects/ProjectSelection';
import Project from './projects/Project';
import VerifyComponent from './register/VerifyComponent';
import Sketch from './Sketch';
import { Route, Redirect, Switch } from 'react-router-dom'


export default class extends React.Component{

  constructor(props) {
    //console.log('AuthenticatedApp:constructor');
    super(props);
    this.state = {
      project: {},
      authenticationError: false
    }
  }

  // componentWillUpdate() {
  //   console.log('AuthenticatedApp:willUpdate');
  // }

  setProject(project) {
    this.setState({project: project});
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
          <AuthenticatedHeader userInfo={this.props.userObject}/>
          <div className="row">
            <div className="alert alert-danger">There is a problem with your user credentais.  Try signing out and loging in again.</div>
          </div>
        </div>
      );
    }

    return(

            <Switch>
              <Route path="/verify" component={VerifyComponent}/>
              <Route path="/project/:projectId/sketch/:sketchIndex" render={(routeProps) => {
                  return <Project
                    projectId={routeProps.match.params.projectId}
                    sketchIndex={routeProps.match.params.sketchIndex}
                    location={routeProps.location}
                    project={this.state.project}
                    userObject={this.props.userObject}
                    authErrorHandler={error => this.authErrorHandler(error)}
                    setProjectHandler={project => {this.setProject(project)}}/>
                }}/>
              <Route render={(routeProps) => {
                  return <ProjectSelection
                    match={routeProps.match}
                    authErrorHandler={error => this.authErrorHandler(error)}
                    userObject={this.props.userObject}/>}} />
            </Switch>

    );
  }
}
