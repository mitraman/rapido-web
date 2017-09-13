import React from 'react'
import ReactDOM from 'react-dom'
import ProjectItem from './ProjectItem'

export default class extends React.Component{

  constructor(props) {
      super(props);
  }

  /* Render Method */
  render() {

    let projects = [];

    this.props.projects.forEach( (project) => {
      projects.push(<ProjectItem key={project.id} project={project} selectionHandler={this.props.selectionHandler} />)
    });

    return (
      <div className="projectList col-md-12">
          {projects}
      </div>
    )
  }
}
