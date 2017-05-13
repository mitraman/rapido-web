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
      project: {}
    }
  }

  setProject(project) {
    console.log('project selected:', project);
    this.setState({project: project});
  }

  /* Render Method */
  render() {

    return(
      <div id="authenticated">
        <AuthenticatedHeader project={this.state.project} userInfo={this.props.userObject}/>
        <div className="row">
          <AlertContainer ref={(a) => this.msg = a} {...this.alertOptions} />
          <Switch>
            <Route path="/project/:projectId" render={(routeProps) => {
                return <Project projectId={routeProps.match.params.projectId}
                  userObject={this.props.userObject}
                  setProjectHandler={project => {this.setProject(project)}}/>}} />
            <Route render={(routeProps) => {
                return <ProjectSelection
                  match={routeProps.match}
                  userObject={this.props.userObject}/>}} />
          </Switch>
        </div>
      </div>
    )
  }
}
