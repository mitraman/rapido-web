import React from 'react'
import AlertContainer from 'react-alert';
import SplitPane from 'react-split-pane';

import Backend from '../adapter/Backend.js';
import CRUDTree from '../d3/CRUDTreeComponent.jsx';
import VocabularyList from './vocabulary/VocabularyList';
import NodeEditor from './sketch/NodeEditor.jsx';

import '../../css/sketch.scss'

export default class extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      sideNavHidden: true,
      selectedNode: null,
      canvasWidth: 0,
      canvasHeight: 0
    }

    this.toggleSideNav = this.toggleSideNav.bind(this);
  }

  componentDidMount() {
    if( this.props.displayNavigationButtons ) {
      this.props.displayNavigationButtons(true);
    }
  }

  toggleSideNav() {
      if( this.state.navState === 'show-nav') {
        // show the side nave and change the state
        this.setState({navState: 'nav-hidden'});
      }else {
        this.setState({navState: 'show-nav'});
      }
  }

  /* Render Method */
  render() {
    let treeData = [
      {
        id: '1',
        name: '/blah',
        url: '/blah',
        fullpath: '/api/blah',
        responseData: {
          'put': '{}'
        },
        children: [
          {
            id: '2',
            name: '/bleh',
            url: '/bleh',
            fullpath: '/api/blah/bleh',
            responseData: {},
            children: [

            ]
          },
          {
            id: '92',
            name: '/yiyi',
            fullpath: '/api/blah/yiyi',
            responseData: {},
            children: [
              {
                id: '232',
                name: '/authors',
                fullpath: '/api/blah/yiyi/authors',
                responseData: {
                  'get': '{ "id": "9923" }'
                },
                children: [

                ]
              }
            ]
          }
        ]
      }
    ];

    let clickHandler = (event) => {
      //console.log(event);
      let eventType = event.name;
      if( eventType === 'detail') {
        // Expand the property pane
        let findNode = function(id, node) {
          if( node.id === id) {
            return node;
          }else {
            for( let i = 0; i < node.children.length; i++ ) {
              let foundNode = findNode(id, node.children[i]);
              if( foundNode ) {
                return foundNode;
                break;
              }
            }
            return null;
          }
        }

        let node = findNode(event.source, treeData[0]);
        //console.log(node);
        this.setState({selectedNode: node});
      }
    }


    let vocabulary = [
      {word: 'word 1', sketches: [12,13]},
      {word: 'word 2', sketches: []},
      {word: 'word 3', sketches: [12]},
      {word: 'word 4', sketches: []}
    ]

    let EditPane =  this.state.selectedNode ? <NodeEditor node={this.state.selectedNode}/> : <div/>;

    return(

      <div id="slide-wrapper" className={this.state.navState} ref={(input) => {this.slideWrapper = input;}}>
        <div id="slide-canvas">

          <div>This should be a child element</div>
          <div id="side-nav">
            <button className="btn btn-sm side-nav-tab" onClick={this.toggleSideNav}><i className="fa fa-book fa-3x" aria-hidden="true"></i></button>
            <h2>Vocabulary</h2>

            <VocabularyList vocabulary={vocabulary}/>
          </div>
          <div>Annotations</div>

          <div className="main-content">
            <div className="sketch-canvas">
              <SplitPane split="horizontal" minSize={100} defaultSize={400}>
                <div className="svg-wrapper">
                  <CRUDTree
                   data={ [treeData,
                     clickHandler,
                     { x: 0, y: 0 }]
                   }
                   width="100%"
                   height="100%" />
               </div>
                <div className="property-pane">
                  <div>
                   {EditPane}
                 </div>
                </div>
              </SplitPane>


           </div>
          </div>
        </div>
      </div>

    )
  }
}
