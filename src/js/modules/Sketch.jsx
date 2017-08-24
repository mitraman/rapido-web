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
      sketchIteration: 0,
      sketchId: 0,
      projectId: 0,
      treeHash: {}
    }
    this.toggleSideNav = this.toggleSideNav.bind(this);
    this.intervalTime = 2000;
    this.delayedNodeUpdate = new DelayedNodeUpdate();
  }

  componentWillMount() {
    //console.log('componentWillMount');
    let sketch = this.props.sketches[this.props.sketchIteration-1];
    this.setState({sketchId: sketch.id});

    this.setState({tree: sketch.tree});

    let hash = this.generateHash(sketch.tree);
    this.setState({treeHash: hash});

    // Remove the detail pane because no node has been selected yet.
    this.setState({splitPaneSize: "100%"});

    document.addEventListener('keydown', (e) => this.handleKeyPress(e), false);
  }

  componentWillReceiveProps() {
    //console.log('componentWillReceiveProps');

    // Update the view based on the new props
    let sketch = this.props.sketches[this.props.sketchIteration-1];
    this.setState({sketchId: sketch.id});
    this.setState({tree: sketch.tree});

    let hash = this.generateHash(sketch.tree);
    this.setState({treeHash: hash});
  }

  // Utility methods to manipulate GUI elements
  showDetailPane() {
    this.setState({splitPaneSize: "150px"});
  }

  hideDetailPane() {
    this.setState({splitPaneSize: "100%"});
  }

  toggleSideNav() {
    //console.log('toggleSideNav');
      if( this.state.navState === 'show-nav') {
        // show the side nave and change the state
        this.setState({navState: 'nav-hidden'});
      }else {
        this.setState({navState: 'show-nav'});
      }
  }

  // Generates the hash table for a tree
  // The tree hash makes it easier for the GUI to find nodes
  generateHash(tree) {
    let storeNode = function(node, hash) {
        // store this node in the hash
        hash[node.id] = node;

        // process children recursively
        node.children.forEach(child => {
          storeNode(child, hash);
        })
    }

    let hash = {};
    tree.forEach(rootNode => {
      storeNode(rootNode, hash);
    })
    return hash;
  }



  // Called by the child CRUDTreeComponent when the user changes the URI of a node
  uriChanged(nodeId, value) {
    // Get the node we need to update
    let node = this.state.selectedNode;
    if(nodeId != this.state.selectedNode.id) {
      node = this.state.treeHash[nodeId];
    }

    // Update the 'name' of the node with the new URI value
    node.name = value;
    let parentNode = this.state.treeHash[node.parentId];
    node.fullpath = parentNode ? parentNode.fullpath + '/' + node.name : '/' + node.name;

    // Update the fullpath for this node and its descendants
    // NOTE: We are operating on the in-memory tree, but the backend will perform the same operation
    let updateChildPaths = function(node) {
      for(let i=0; i < node.children.length; i++) {
        let childNode = node.children[i];
        childNode.fullpath = node.fullpath + '/' + childNode.name;
        updateChildPaths(childNode);
      }
    }
    updateChildPaths(node);

    //redraw the page
    this.forceUpdate();

    // Schedule a backend update to persist changes to the backend server
    this.delayedNodeUpdate.write(this.props.userObject.token,
      this.props.projectId,
      this.props.sketchIteration,
      nodeId,
      { name: node.name },
      this.intervalTime)
    .then( result => {
      //TODO: Alert the user that changes have been saved.
      //console.log('saved.');
    })
  }

  // called when a node's method data has been updated
  dataChanged(id,key,fieldMap) {
    let updateObject = {
      data: {}
    };
    updateObject.data[key] = fieldMap;

    if( fieldMap.hasOwnProperty('enabled') ) {
      // This type of change will impact the badges visible on the node
      // Update the node in the tree
      //let node = this.findNode(id, this.state.tree);
      let node = this.state.treeHash[id];
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

    this.delayedNodeUpdate.write(this.props.userObject.token,
      this.props.projectId,
      this.props.sketchIteration,
      this.state.selectedNode.id,
      updateObject,
      this.intervalTime)
    .then( result => {
      //TODO: Alert the user that changes have been saved.
      //console.log('saved.');
    })
  }

  // Called when the GUI triggers an add child event
  addChild(parent) {
    let parentId = parent ? parent.id : null;
    /*
    this.delayedNodeUpdate.flush()
    .then( () => {
      return Backend.addChildNode(this.props.userObject.token,
        this.props.projectId,
        this.props.sketchIteration,
        parentId)
    }).then( (result) => {*/
    Backend.addChildNode(this.props.userObject.token,
      this.props.projectId,
      this.props.sketchIteration,
      parentId)
    .then( result => {
      // The backend returns an updated version of the tree with the new node
      let tree = result.tree;
      this.setState({tree: tree});

      let hash = this.generateHash(tree)
      this.setState({treeHash: hash});

      let nodeId = result.node.id;

      let newNode = this.state.treeHash[nodeId];
      //let parentPath = parent ? parent.fullpath : '';
      //newNode.fullpath = parentPath;
      this.setState({selectedNode: newNode});
      // If the split panel is hidden, create a split by setting the default splitPaneSize
      if( this.state.splitPaneSize === "100%") {
        this.setState({splitPaneSize: "150px"});
      }
    })
  }

  clickHandler(event) {
    let eventType = event.name;

    if( eventType === 'reset') {
      // Reset the sketch view

      this.setState({selectedNode: '/'});
      this.setState({splitPaneSize: "100%"});

    }else if( eventType === 'add') {
      // Add a new child node

      let tree = this.state.tree;

      let parent = null;
      if( event.source ) {
        // If the source is not null, the new node will be a child of an existing node
        //parent = this.findNode(event.source, tree);
        parent = this.state.treeHash[event.source]
      }

      //TODO: use the delayedNodeUpdate function
      // If there is a pending change, trigger it first.
      if(this.timeoutID) {
        Backend.updateNode(this.props.userObject.token,
          this.props.sketchIteration,
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
      // Display editable properties of a node

      //let node = this.findNode(event.source, this.state.tree);
      let node = this.state.treeHash[event.source];
      this.setState({selectedNode: node});
      // If the split panel is hidden, create a split by setting the default splitPaneSize
      if( this.state.splitPaneSize === "100%") {
        this.setState({splitPaneSize: "150px"});
      }
    }else if( eventType === 'delete') {
      // Popup a delete confirmation modal, if the user accepts deletion,
      // handleDeleteConfirmed() will be called.
      $('#deleteConfirmationModal').modal();
    }
  }

  // Deletes a sub-tree or node after the user confirms a deletion request
  handleDeleteConfirmed() {
    // Make sure that the selected node exists and is not the root node
    let selectedNode = this.state.selectedNode;
    if( selectedNode && selectedNode != '/') {

      // If there are operations waiting to be saved, send them to the backend now
      this.delayedNodeUpdate.flush()
      .then( () => {
        // Make the delete request
        Backend.deleteNode(this.props.userObject.token,
          this.props.projectId,
          this.props.sketchIteration,
          selectedNode.id)
      }).then( (result) => {
        // Get the updated tree and render it again
        return Backend.getSketch(this.props.userObject.token, this.state.sketchId);
      }).then( result => {
        let tree = result.sketch.tree;

        this.setState({selectedNode: '/'});
        this.setState({tree: tree});

        let hash = this.generateHash(tree);
        this.setState({treeHash: hash});

        // Remove the detail pane because no node has been selected yet.
        this.hideDetailPane();

      }).catch( e => {
        console.log('something went wrong while trying to delete this node:', e);
      })

    }
  }

  // Keyboard accelerators
  handleKeyPress(event) {
    //console.log(event);
    if( event.key === 'Escape') {
      this.setState({selectedNode: '/'});
      this.hideDetailPane();
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
    }else if( event.key === 'Delete') {
      let selectedNode = this.state.selectedNode;
      if( selectedNode && selectedNode != '/') {
        // Popup a confirmation modal
        $('#deleteConfirmationModal').modal();
      }
    }else if(event.key === 'ArrowLeft') {
      // Try to move to the parent node
      let selectedNode = this.state.selectedNode;
      if( selectedNode === '/') { return; }
      let parent = this.state.treeHash[selectedNode.parentId];
      if( parent ) {
        this.setState({selectedNode: parent});
      }else {
        this.setState({selectedNode: '/'});
        this.hideDetailPane();
      }
    }else if( event.key === 'ArrowRight') {
      // Try to move to a child node
      let selectedNode = this.state.selectedNode;
      if(selectedNode === '/' ) {
        // Move to the middle root node
        if( this.state.tree.length > 0) {
          let index = Math.ceil(this.state.tree.length / 2);
          this.setState({selectedNode: this.state.tree[index-1]})
        }
      }else if(selectedNode.children.length > 0 ) {
        // Move to the middle child
        let index = Math.ceil(selectedNode.children.length / 2);
        this.setState({selectedNode: selectedNode.children[index-1]});
      }
    }else if( event.key === 'ArrowDown') {
      // Try to move to the next sibling
      let selectedNode = this.state.selectedNode;
      if( selectedNode === '/') { return; }
      let parent = this.state.treeHash[selectedNode.parentId];
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
      if( selectedNode === '/') { return; }
      let parent = this.state.treeHash[selectedNode.parentId];
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

    <div id="sketch">

    <div id="deleteConfirmationModal" className="modal fade" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-body">
            <p>Are you sure you want to delete this node and all of its children?</p>
          </div>
          <div className="modal-footer">
            <button
              onClick={() => this.handleDeleteConfirmed()}
              type="button"
              className="btn btn-danger pull-left"
              data-dismiss="modal">Delete</button>
            <button type="button" className="btn btn-primary" data-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <div id="slide-wrapper"
      className={this.state.navState}
      ref={(input) => {this.slideWrapper = input;}}>
      <div id ="slide-canvas">

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
            <SplitPane
              split="horizontal"
              size={this.state.splitPaneSize}
              minSize={100}>
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

    </div>
    )
  }
}
