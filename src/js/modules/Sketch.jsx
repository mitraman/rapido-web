import React from 'react'
import AlertContainer from 'react-alert';
import Backend from '../adapter/Backend.js';
import CRUDTree from '../d3/CRUDTreeComponent.jsx';

export default class extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    if( this.props.displayNavigationButtons ) {
      this.props.displayNavigationButtons(true);
    }
  }

  /* Render Method */
  render() {

    let treeData = [];

    let clickHandler = {};

    let width = 1000;
    let height = 800;

    return(
      <div id="sketch">
        <CRUDTree
           data={ [treeData,
             clickHandler,
             { x: 0, y: 0 }]
           }
           width={width}
           height={height} />
      </div>
    )
  }
}
