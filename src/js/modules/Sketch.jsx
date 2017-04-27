import React from 'react'
import AlertContainer from 'react-alert';
import Backend from '../adapter/Backend.js';
import CRUDTree from '../d3/CRUDTreeComponent.jsx';

import VocabularyList from './vocabulary/VocabularyList';

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

    let vocabulary = [
      {word: 'word 1', sketches: [12,13]},
      {word: 'word 2', sketches: []},
      {word: 'word 3', sketches: [12]},
      {word: 'word 4', sketches: []}
    ]

    return(
      <div id="sketch">
        <div className="col-md-2">
          <VocabularyList vocabulary={vocabulary}/>
        </div>
        <div className="col-md-10">
        <CRUDTree
           data={ [treeData,
             clickHandler,
             { x: 0, y: 0 }]
           }
           width={width}
           height={height} />
         </div>
      </div>
    )
  }
}
