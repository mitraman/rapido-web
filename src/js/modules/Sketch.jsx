import React from 'react'
import AlertContainer from 'react-alert';
import SplitPane from 'react-split-pane';

import Backend from '../adapter/Backend.js';
import CRUDTree from '../d3/CRUDTreeComponent.jsx';
import VocabularyList from './vocabulary/VocabularyList';
import NodeEditor from './sketch/NodeEditor.jsx';
import ZoomComponent from './sketch/ZoomComponent.jsx';
import DelayedNodeUpdate from '../adapter/DelayedNodeUpdate.js'

import '../../css/sketch.scss'

export default class extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      selectedNode: '/',
      tree: [],
      selectedIteration: 0,
      sketchId: 0,
      projectId: 0
    }
    this.toggleSideNav = this.toggleSideNav.bind(this);
    this.intervalTime = 2000;
    this.delayedNodeUpdate = new DelayedNodeUpdate();
  }

  componentDidMount() {
    let sketch = this.props.sketches[this.props.sketchIteration-1];
    this.setState({sketchId: sketch.id});

    this.parseTree(sketch.tree);
    this.setState({tree: sketch.tree});

    // Remove the detail pane because no node has been selected yet.
    this.setState({splitPaneSize: "100%"});

    document.addEventListener('keydown', (e) => this.handleKeyPress(e), false);

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

  // Add helper properties to the tree structure for the GUI and processing
  parseTree(tree) {
    let parseNode = function(node, parentNode) {
      node.parent = parentNode;
      if( !parentNode ) {
        node.prePath = '/';
      }else {
        node.prePath = parentNode.fullpath + '/';
      }
      node.fullpath = node.prePath + node.name;


      node.children.forEach( child => {
        parseNode(child, node);
      });
    }

    tree.forEach(root => {
      parseNode(root);
    })
  }

  __scheduleUpdate(nodeId, updateObject) {

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

    let node = this.state.selectedNode;
    if(nodeId != this.state.selectedNode.id) {
      node = this.findNode(nodeId, this.state.tree);
    }

    // Update the name of the node
    node.name = value;
    node.fullpath = node.prePath + node.name;

    //update the fullpath for this node and its children
    let updateChildPaths = function(node) {
      for(let i =0; i < node.children.length; i++) {
        let childNode = node.children[i];
        childNode.prePath = node.fullpath + '/';
        childNode.fullpath = childNode.prePath + childNode.name;
        updateChildPaths(childNode);
      }
    }
    updateChildPaths(node);

    //redraw the page
    this.forceUpdate();

    // Schedule an update to persist changes to the backend server
    //this.scheduleUpdate(node.id, { name: node.name, fullpath: node.fullpath});
    this.delayedNodeUpdate.write(this.props.userObject.token,
      this.props.projectId,
      this.state.sketchId,
      nodeId,
      { name: node.name, fullpath: node.fullpath},
      this.intervalTime)
    .then( result => {
      //TODO: Alert the user that changes have been saved.
      //console.log('saved.');
    })
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
    this.delayedNodeUpdate.write(this.props.userObject.token,
      this.props.projectId,
      this.state.sketchId,
      this.state.selectedNode.id,
      updateObject,
      this.intervalTime)
    .then( result => {
      //TODO: Alert the user that changes have been saved.
      //console.log('saved.');
    })
  }

  addChild(parent) {
    let parentId = parent ? parent.id : null;
    Backend.addChildNode(this.props.userObject.token, this.props.projectId, this.state.sketchId, parentId)
    .then( (result) => {
      // The backend returns an updated version of the tree with the new node
      let tree = result.tree;
      this.parseTree(tree)
      this.setState({tree: tree});
      let nodeId = result.node.id;

      let newNode = this.findNode(nodeId, result.tree);
      //let parentPath = parent ? parent.fullpath : '';
      //newNode.fullpath = parentPath;
      this.setState({selectedNode: newNode});
    })
  }

  clickHandler(event) {
    let eventType = event.name;

    if( eventType === 'reset') {
      this.setState({selectedNode: '/'});
      this.setState({splitPaneSize: "100%"});
    }else if( eventType === 'add') {
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
      // If the split panel is hidden, create a split by setting the default splitPaneSize
      if( this.state.splitPaneSize === "100%") {
        this.setState({splitPaneSize: "150px"});
      }
    }
  }

  displayDetail() {
    this.setState({splitPaneSize: "150px"});
  }

  displayOverview() {
    this.setState({splitPaneSize: "100%"});
  }

  handleKeyPress(event) {
    //console.log(event);
    if( event.key === 'Escape') {
      this.setState({selectedNode: '/'});
      this.displayOverview();
    }

    if( document.activeElement != null && document.activeElement.localName != 'body') {
      // The user is probably focused on an input field, so don't do anything with
      // keys
      return;
    }

    if(event.key === '+') {
      let selectedNode = this.state.selectedNode;
      console.log('to be implemented');
      //this.addChild(selectedNode);
    }else if(event.key === 'ArrowLeft') {
      // Try to move to the parent node
      let selectedNode = this.state.selectedNode;
      let parent = selectedNode.parent;
      if( parent ) {
        this.setState({selectedNode: parent});
      }else {
        this.setState({selectedNode: '/'});
        this.displayOverview();
      }
    }else if( event.key === 'ArrowRight') {
      // Try to move to a child node
      let selectedNode = this.state.selectedNode;
      if(selectedNode === '/' ) {
        if( this.state.tree.length > 0) {
          this.setState({selectedNode: this.state.tree[0]})
        }
      }else if(selectedNode.children.length > 0 ) {
        this.setState({selectedNode: selectedNode.children[0]});
      }
    }else if( event.key === 'ArrowDown') {
      // Try to move to the next sibling
      let selectedNode = this.state.selectedNode;
      let parent = selectedNode.parent;
      if( !parent ) {
        for( let i = 0; i < this.state.tree.length; i++ ) {
          let rootNode = this.state.tree[i];
          if( rootNode.id === selectedNode.id ) {
            if( (i + 1) < this.state.tree.length ) {
              this.setState({selectedNode: this.state.tree[i+1]});
            }
            return;
          }
        }
      } else {
        for( let i = 0; i < parent.children.length; i++) {
          let childNode = parent.children[i];
          if( childNode.id === selectedNode.id) {
            if( (i + 1) < parent.children.length ) {
              this.setState({selectedNode: parent.children[i+1]});
            }
            return;
          }
        }
      }
    }else if( event.key === 'ArrowUp' ) {
      // Try to move to the previous sibling
      let selectedNode = this.state.selectedNode;
      let parent = selectedNode.parent;
      let prevSibling = null;
      if( !parent ) {
        for( let i = 0; i < this.state.tree.length; i++ ) {
          let rootNode = this.state.tree[i];
          if( rootNode.id === selectedNode.id) {
            if( i > 0) {
              this.setState({selectedNode: prevSibling});
            }
            return;
          }
          prevSibling = rootNode;
        }
      }else {
        for( let i = 0; i < parent.children.length; i++) {
          let childNode = parent.children[i];
          if( childNode.id === selectedNode.id) {
            if( i > 0) {
              this.setState({selectedNode: prevSibling});
            }
            return;
          }
          prevSibling = childNode;
        }
      }
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

          <div className="main-content">
            <div className="sketch-canvas">
              <SplitPane split="horizontal" size={this.state.splitPaneSize} minSize={100}>
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
