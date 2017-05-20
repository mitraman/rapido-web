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
    this.toggleSideNav = this.toggleSideNav.bind(this);
  }

  componentDidMount() {
    let sketch = this.props.sketches[this.props.sketchIteration-1];
    this.setState({sketchId: sketch.id});

    sketch.tree.forEach( root => {
      this.updatePath(root, '');
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
  findNode(id, nodeList) {
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

  scheduleUpdate(nodeId, updateObject) {

    const intervalTime = 2000;

    // check if a timeout is already scheduled
    if(this.timeoutID) {
      // Cancel the last timeout
      window.clearTimeout(this.timeoutID);

      if( this.pendingUpdate.id === nodeId) {
        // This is another update for the same node, so merge the updateObjects
        if( updateObject.name ) {
          this.pendingUpdate.updateObject.name = updateObject.name;
        }
        if( updateObject.fullpath ) {
          this.pendingUpdate.updateObject.fullpath = updateObject.fullpath;
        }
        if( updateObject.data ) {
          this.pendingUpdate.updateObject.data = updateObject.data;
        }
      }else {
        // This is an update for a new node, so fire off the old one immediately
        Backend.updateNode(this.props.userObject.token,
          this.state.sketchId,
          this.pendingUpdate.id,
          this.pendingUpdate.updateObject);
      }
    }

    // Save the update details
    this.pendingUpdate = {
      id: nodeId,
      updateObject: updateObject
    }

    // Scheudle the new update
    this.timeoutID = window.setTimeout(() => {
      Backend.updateNode(this.props.userObject.token,
        this.state.sketchId,
        this.pendingUpdate.id,
        this.pendingUpdate.updateObject);

        // TODO: alert with a toast

    }, intervalTime)
  }

  uriChanged(nodeId, value) {
    // fullpath: (parentPath) + / + name

    // Update the tree node

    // Find the node in the tree
    let node = this.findNode(nodeId, this.state.tree);

    // Determine the parentpath based on the original name of the node
    let re = new RegExp(node.name + '$');
    let pathIndex = node.fullpath.search(re);
    let parentPath = '';
    if( pathIndex > 0) {
      parentPath = node.fullpath.slice(0, pathIndex);
    }

    // Update the name of the node
    node.name = value;

    //update the fullpath for this node and its children
    this.updatePath(node, parentPath);

    //redraw the page
    this.forceUpdate();

    // Schedule the update
    this.scheduleUpdate(node.id, { name: node.name, fullpath: node.fullpath});
  }

  dataChanged(id,key,fieldMap) {
    let updateObject = {
      data: {}
    };
    updateObject.data[key] = fieldMap;

    if( fieldMap.hasOwnProperty('enabled') ) {
      // This type of change will impact the badges visible on the node
      // Update the node in the tree
      let node = this.findNode(id, this.state.tree);
      if(!node.data[key]) {
        node.data[key] = {
          enabled: true
        }
      }else {
        node.data[key].enabled = fieldMap.enabled;
      }

      // Redraw the tree
      this.forceUpdate();
    }

    //TODO: schedule this update
    Backend.updateNode(this.props.userObject.token,
      this.state.sketchId,
      this.state.selectedNode.id,
      updateObject);
  }

  addChild(parent) {
    let parentId = parent ? parent.id : null;
    Backend.addChildNode(this.props.userObject.token, this.state.sketchId, parentId)
    .then( (result) => {
      // The backend returns an updated version of the tree with the new node
      this.setState({tree: result.tree});
      let nodeId = result.node.id;

      let newNode = this.findNode(nodeId, result.tree);
      let parentPath = parent ? parent.fullpath : '';
      newNode.fullpath = parentPath;
      this.setState({selectedNode: newNode});
    })
  }

  clickHandler(event) {
    let eventType = event.name;

    if( eventType === 'add') {
      let tree = this.state.tree;

      let parent = null;
      if( event.source ) {
        // If the source is not null, the new node will be a child of an existing node
        parent = this.findNode(event.source, tree);
      }

      // If there is a pending change, trigger it first.
      if(this.timeoutID) {
        Backend.updateNode(this.props.userObject.token,
          this.state.sketchId,
          this.pendingUpdate.id,
          this.pendingUpdate.updateObject)
        .then( () => {
          this.addChild(parent);
        })
        // Cancel the existing timeout
        window.clearTimeout(this.timeoutID);
      }else {
        this.addChild(parent);
      }
    }else if( eventType === 'detail') {
      let node = this.findNode(event.source, this.state.tree);
      this.setState({selectedNode: node});
    }
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
        uriChangeHandler={(id,val)=>{this.uriChanged(id,val)}}
        dataChangeHandler={(id,key,fields)=>{this.dataChanged(id,key,fields)}}
        /> : <div/>;



    return(

      <div id="slide-wrapper"
        className={this.state.navState}
        ref={(input) => {this.slideWrapper = input;}}
        >
        <div id="slide-canvas">
          <div id="side-nav">
            <button className="btn btn-sm side-nav-tab"
              onClick={this.toggleSideNav}>
              <i className="fa fa-book fa-2x" aria-hidden="true"></i>
            </button>
            <h2>Vocabulary</h2>

            <VocabularyList vocabulary={vocabulary}/>
          </div>
          <div>Annotations</div>

          <div className="main-content">
            <div className="sketch-canvas">
              <SplitPane split="horizontal" size={this.state.splitPaneSize} minSize={100} defaultSize={400}>
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

        </div>
      </div>

    )
  }
}
