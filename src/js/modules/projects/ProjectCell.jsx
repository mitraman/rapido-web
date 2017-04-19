import React from 'react'
import ReactDOM from 'react-dom'

export default class extends React.Component{

  constructor(props) {
      super(props);

  }

  handleClick(e) {
    this.props.selectionHandler(this.props.project.id);
  }

  /* Render Method */
  render() {

    const linkId = 'select' + this.props.project.id;

    return (
      <div className="col-md-4 projectCell">
        <a id={linkId} href="#" onClick={(e) => {this.handleClick(e)} }>
        <div className="projectName">{this.props.project.name}</div>
        <div className="projectDescription">{this.props.project.description}</div>
        </a>
      </div>
    )
  }
}
