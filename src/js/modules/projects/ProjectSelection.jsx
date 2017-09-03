import React from 'react'
import AlertContainer from 'react-alert';
import ProjectGrid from './ProjectGrid';
import ProjectList from './ProjectList';
import Backend from '../../adapter/Backend.js';
import ProjectForm from './ProjectForm.jsx'
import Modal from '../Modal.jsx'
import { Route, Redirect } from 'react-router-dom'

export default class extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      view: 'grid'
    }
  }

  componentDidMount() {
    // Retrieve projects from the Backend
    Backend.getProjects(this.props.userObject.token)
    .then( (result) => {
      this.setState({projects: result.projects})
    })
  }

  selectionHandler(projectId) {
    //For now we always load the first sketch iteration.
    let path = '/project/' + projectId + '/sketch/1';
    this.setState({projectPath: path});
  }

  projectCreated(projectId) {
    // Close the modal and redirect to the new project
    $('#projectModal').modal('hide');
    this.selectionHandler(projectId);
  }

  /* Render Method */
  render() {

    let projectsView;
    if( this.state.view === 'grid' ) {
      projectsView = <ProjectGrid projects={this.state.projects} selectionHandler={(e) => this.selectionHandler(e)}/>
    }else if( this.state.view === 'list' ) {
      projectsView = <ProjectList projects={this.state.projects} selectionHandler={this.selectionHandler}/>
    }

    let projectForm = <ProjectForm projectCreated={id => {this.projectCreated(id)} } {...this.props}/>

    if(this.state.projectPath) {
      return <Redirect push to={this.state.projectPath}/>
    }

    return(
      <div className="col-md-12">
      <div id="projectSelector">
        <Modal id="projectModal" title="New Project" body={projectForm}/>
        <div className ="buttonbar">
          <button className="btn btn-default btn-lg" type="button" data-toggle="modal" data-target="#projectModal" >Create a New Project..</button>
          <div className="btn-group pull-right">
            <button className="btn btn-sm"
              type="button"
              onClick={ (e)=>{ this.setState({view: 'grid'}) }}><span className="glyphicon glyphicon-th" aria-hidden="true"></span></button>
            <button className="btn btn-sm"
              type="button"
              onClick={ (e)=>{ this.setState({view: 'list'}) }}><span className="glyphicon glyphicon-th-list" aria-hidden="true"></span></button>
          </div>
      </div>
        <div className="row projectsview button-bar-buffer">
          {projectsView}
        </div>
      </div>
      </div>
    )
  }
}
