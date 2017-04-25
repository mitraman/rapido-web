import React from 'react'
import RegistrationForm from './register/RegistrationForm'
import AlertContainer from 'react-alert';
import ProjectGrid from './projects/ProjectGrid';
import ProjectList from './projects/ProjectList';
import Backend from '../adapter/Backend.js';
import ProjectForm from './projects/ProjectForm.jsx'
import Modal from './Modal.jsx'
import createHistory from 'history/createBrowserHistory'
const history = createHistory();


export default class extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      view: 'grid'
    }
  }

  componentDidMount() {
    console.log('project component mounted.');
    // Retrieve projects from the Backend
    Backend.getProjects(this.props.userObject.token)
    .then( (result) => {
      this.setState({projects: result.projects})
    })
  }

  /* Render Method */
  render() {
    let selectionHandler = function(projectId) {
      let path = "/project/" + projectId + "/sketch/1";
      //console.log(path);
      history.push(path);
    }

    let projectsView;
    if( this.state.view === 'grid' ) {
      projectsView = <ProjectGrid projects={this.state.projects} selectionHandler={selectionHandler}/>
    }else if( this.state.view === 'list' ) {
      projectsView = <ProjectList projects={this.state.projects} selectionHandler={selectionHandler}/>
    }

    let projectCreated = function() {

    }

    let projectForm = <ProjectForm projectCreated={projectCreated} {...this.props}/>

    return(
      <div id="projects">
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
        <div className="row projectsview top-buffer">
          {projectsView}
        </div>
      </div>
    )
  }
}
