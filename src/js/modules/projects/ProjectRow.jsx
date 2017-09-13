import React from 'react'
import ReactDOM from 'react-dom'
import ProjectCell from './ProjectCell'

export default class extends React.Component{

  constructor(props) {
      super(props);
  }

  /* Render Method */
  render() {

    let projectCells = [];

    this.props.projects.forEach((project)=> {
      projectCells.push(<ProjectCell
        key={project.id}
        project={project}
        selectionHandler={this.props.selectionHandler}
        deletionHandler={this.props.deletionHandler}/>);
    })

    return (
      <div className="row projectRow" >
        {projectCells}
      </div>
    )
  }
}
