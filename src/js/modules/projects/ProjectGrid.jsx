import React from 'react'
import ReactDOM from 'react-dom'
import ProjectRow from './ProjectRow'
import '../../../css/grid.scss'

export default class extends React.Component{

  constructor(props) {
      super(props);
  }

  /* Render Method */
  render() {
    // Create a bootstrap grid based on the project list
    let rows = [[]];
    let rowIndex = 0;
    const maxRowSize = 3;

    // Organize the data into row of maxsize
    this.props.projects.forEach((project, index) => {
      if( rows[rowIndex].length >= maxRowSize ) {
        // Start a new row
        rows.push([]);
        rowIndex++;
      }
      rows[rowIndex].push(project);
    })

    // Render a projectRow for each row that we have
    let projectRows = [];
    rows.forEach( (row,index)=> {
      projectRows.push(<ProjectRow key={index} projects={row} selectionHandler={this.props.selectionHandler} />);
    });

    return (
      <div id="projectGrid">
        {projectRows}
      </div>
    )
  }
}
