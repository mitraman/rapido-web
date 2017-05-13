import React from 'react'
import AlertContainer from 'react-alert';
import SplitPane from 'react-split-pane';

import Backend from '../adapter/Backend.js';
import CRUDTree from '../d3/CRUDTreeComponent.jsx';
import VocabularyList from './vocabulary/VocabularyList';
import NodeEditor from './sketch/NodeEditor.jsx';
import ZoomComponent from './sketch/ZoomComponent.jsx';

import '../../css/sketch.scss'

export default class extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      selectedNode: null,
      tree: [],
      selectedIteration: 0,
      sketchId: 0
    }
    this.nodeHash = {};

    this.toggleSideNav = this.toggleSideNav.bind(this);
  }

  componentDidMount() {
    console.log('sketches:', this.props.sketches);
    let sketch = this.props.sketches[this.props.sketchIteration-1];
    this.setState({sketchId: sketch.id});

    sketch.tree.forEach( root => {
      this.updatePath(root, '/');
    })

    this.setState({tree: sketch.tree});
  }


  toggleSideNav() {
      if( this.state.navState === 'show-nav') {
        // show the side nave and change the state
        this.setState({navState: 'nav-hidden'});
      }else {
        this.setState({navState: 'show-nav'});
      }
  }

  //Recursive function to walk through tree
  // If findNode needs to be called often, we can use a hash to speed it up
  findNode(id, nodeList) {
    console.log('TODO: cache the tree with a hash to make lookups faster')
    for( let i = 0; i < nodeList.length; i++ ) {
      if( nodeList[i].id === id ) {
        return nodeList[i];
      }else if( nodeList[i].children && nodeList[i].children.length > 0) {
        let result = this.findNode(id, nodeList[i].children)
        if( result ) {
          return result;
        }
      }
    }
    return null;
  }

  updatePath(node, parentPath) {
    node.fullpath = parentPath + node.name;
    node.children.forEach( child => {
      this.updatePath(child, node.fullpath);
    });
  }


  uriChanged(nodeId, value) {
    // Update the tree node
    let node = this.findNode(nodeId, this.state.tree);

    // Determine the parentpath based on the name of the node
    let re = new RegExp(node.name + '$');
    console.log(re);
    let pathIndex = node.fullpath.search(re);
    let parentPath = node.fullpath.split(0, pathIndex);
    console.log(parentPath);
    //update the fullpath for this node and its children
    //updatePath(node)

    //TODO: Should the frontend write the path changes? or should the backend do it automatically?

    //update state so that the page renders again
    this.forceUpdate();

    node.name = value;

    // Start a timer to save the changes
    const intervalTime = 3000;
    if(this.timeoutID) {
      // Cancel the last timeout
      window.clearTimeout(this.timeoutID);    }
    this.timeoutID = window.setTimeout(() => {
      //TODO: update a set of nodes so that the entire subtree can be updated (because of the fullpath change);
      Backend.updateNode(this.props.userObject.token, this.state.sketchId, node);

      // alert with a toast
    }, intervalTime)
  }

  clickHandler(event) {
    let eventType = event.name;

    if( eventType === 'add') {
      let tree = this.state.tree;

      let parent = null;
      if( event.source ) {
        // If the source is not null, the new node will be a child of an existing node
        parent = this.findNode(event.source, tree).id;
      }

      Backend.addChildNode(this.props.userObject.token, this.state.sketchId, parent)
      .then( (result) => {
        console.log('result:',result);
        // The backend returns an updated version of the tree with the new node
        this.setState({tree: result.tree});
        let nodeId = result.node.id;

        console.log(nodeId);
        let newNode = this.findNode(nodeId, result.tree);
        this.setState({selectedNode: newNode});
      })

    }else if( eventType === 'detail') {
      console.log('detail');
      console.log(event.source);
      let node = this.findNode(event.source, this.state.tree);
      console.log(node);
      this.setState({selectedNode: node});
    }
  }

  zoomHandler(magnification) {
    console.log('zoomHandler');

    // Update the render based on the new magnification
  }


  /* Render Method */
  render() {

    let vocabulary = [
      {word: 'word 1', sketches: [12,13]},
      {word: 'word 2', sketches: []},
      {word: 'word 3', sketches: [12]},
      {word: 'word 4', sketches: []}
    ]

    let EditPane =  this.state.selectedNode ?
      <NodeEditor
        node={this.state.selectedNode}
        uriChangeHandler={(id,val)=>{this.uriChanged(id,val)}}/> : <div/>;

    return(

      <div id="slide-wrapper"
        className={this.state.navState}
        ref={(input) => {this.slideWrapper = input;}}
        >
        <div id="slide-canvas">

          <div>This should be a child element</div>
          <div id="side-nav">
            <button className="btn btn-sm side-nav-tab"
              onClick={this.toggleSideNav}>
              <i className="fa fa-book fa-3x" aria-hidden="true"></i>
            </button>
            <h2>Vocabulary</h2>

            <VocabularyList vocabulary={vocabulary}/>
          </div>
          <div>Annotations</div>

          <div className="main-content">
            <div className="sketch-canvas">
              <SplitPane split="horizontal" minSize={100} defaultSize={400}>
                <div className="svg-wrapper">
                  <CRUDTree
                    rootNodes={this.state.tree}
                    handler={ e => {this.clickHandler(e)}}
                    width="100%"
                    height="100%"
                    selectedNode={this.state.selectedNode} />
               </div>
                <div className="property-pane">
                  <div>
                   {EditPane}
                 </div>
                </div>
              </SplitPane>
           </div>
          </div>
          <div className="zoom-controls">
            <ZoomComponent zoomHandler={(magnification) => {this.zoomHandler(magnification)}}/>
          </div>
        </div>
      </div>

    )
  }
}
