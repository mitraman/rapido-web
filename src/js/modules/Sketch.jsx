import React from 'react'
import AlertContainer from 'react-alert';
import SplitPane from 'react-split-pane';

import Backend from '../adapter/Backend.js';
import CRUDTree from '../d3/CRUDTreeComponent.jsx';
import VocabularyList from './vocabulary/VocabularyList';
import NodeEditor from './sketch/NodeEditor.jsx';
import ZoomComponent from './sketch/ZoomComponent.jsx';
import DelayedNodeUpdate from '../adapter/DelayedNodeUpdate.js'
import TreeParser from './vocabulary/TreeParser.js';

import '../../css/sketch.scss'

export default class extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      selectedNode: null,
      rootNode: null,
      sketchIteration: 0,
      sketchId: 0,
      projectId: 0,
      butttonpanel_display: 'none',
      treeHash: {},
      vocabulary: []
    }
    this.toggleSideNav = this.toggleSideNav.bind(this);
    this.intervalTime = 2000;
    this.delayedNodeUpdate = new DelayedNodeUpdate();
    this.treeParser = new TreeParser();
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log('this.props:', this.props);
  //   console.log('Sketch.componentWillReceiveProps - nextProps:', nextProps);
  // }
  //
  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('Sketch.shouldComponentUpdate - nextProps:', nextProps);
  //   console.log('Sketch.shouldComponentUpdate - nextState:', nextState);
  //   return true;
  // }

  componentWillMount() {
    let sketch = this.props.sketches[this.props.sketchIteration-1];
    this.initializeTree(sketch);


    // Remove the detail pane because no node has been selected yet.
    this.setState({splitPaneSize: "100%"});

    document.addEventListener('keydown', (e) => this.handleKeyPress(e), false);


  }

  componentWillReceiveProps() {
    //console.log('componentWillReceiveProps');

    // Update the view based on the new props
    let sketch = this.props.sketches[this.props.sketchIteration-1];
    this.initializeTree(sketch);

  }

  selectNode(node) {
    //console.log('selectNode:', node);
    this.setState({selectedNode: node});
    if( node.type === 'root'){
      this.setState({butttonpanel_display: 'none'})
    }else {
      this.setState({butttonpanel_display: 'block'})
    }
    //console.log('selectNode complete');
  }

  // Initializes state parameters and view when a new sketch is loaded
  initializeTree(sketch, selectedNode) {
    //console.log('initializeTree:', sketch);
    this.setState({sketchId: sketch.id});
    this.setState({rootNode: sketch.rootNode});
    let hash = this.generateHash(sketch.rootNode);
    this.setState({treeHash: hash});
    //this.selectNode(sketch.rootNode);
    if( selectedNode ) {
      this.setState({selectedNode: selectedNode});
      this.setState({butttonpanel_display: 'block'})
    }else {
      this.setState({selectedNode: sketch.rootNode});
      this.setState({butttonpanel_display: 'none'});
    }
    let vocabulary = this.treeParser.parseTree(sketch.rootNode);
    //console.log(vocabulary);
    this.setState({vocabulary: vocabulary});
    //console.log('initializeTree done');
    //console.log('buildingTree:', this.state._buildingTree);
    //this.setState({selectedNode: sketch.rootNode});
  }

  // Generates the hash table for a tree
  // The tree hash makes it easier for the GUI to find nodes
  generateHash(rootNode) {
    //console.log('generateHash:', rootNode);
    let storeNode = function(node, hash) {
        // store this node in the hash
        hash[node.id] = node;

        // process children recursively
        node.children.forEach(child => {
          storeNode(child, hash);
        })
    }

    let hash = {};
    storeNode(rootNode, hash);
    return hash;
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

    //TODO: Update the backend API to support finer grained update events
    // so we only have to send the delta rather than the whole data object
    updateObject.data[key] = fieldMap;

    let node = this.state.treeHash[id];

    // Check if there is a request and response object on the update event
    // if so, update the in-memory node
    if(fieldMap.hasOwnProperty('enabled')) {
      node.data[key].enabled = fieldMap.enabled;
      // Redraw the tree
      this.forceUpdate();
    }
    if(fieldMap.request) {
      node.data[key].request = fieldMap.request;
    }
    if(fieldMap.response) {
      node.data[key].response = fieldMap.response;
    }

    // Schedule an update
    this.delayedNodeUpdate.write(this.props.userObject.token,
      this.props.projectId,
      this.props.sketchIteration,
      this.state.selectedNode.id,
      updateObject,
      this.intervalTime)


    .then( result => {
      //TODO: Alert the user that changes have been saved.
      //console.log('saved.');

      // Update the vocab list
      let vocab = this.treeParser.parseTree(this.state.rootNode);
      //console.log('new vocab:', vocab);
      this.setState({vocabulary:vocab});
    }).catch( e => {
      console.log('error: ', e);
    })
  }

  // Called when the GUI triggers an add child event
  addChild(parentId) {
    // Write any pending changes first
    this.delayedNodeUpdate.flush()
    .then( () => {
      return Backend.addChildNode(this.props.userObject.token,
      this.props.projectId,
      this.props.sketchIteration,
      parentId);
    }).then( result => {
      //TODO: If the result contains tree, just use initializeTree()
      // The backend returns an updated version of the tree with the new node
      let rootNode = result.rootNode;
      this.setState({rootNode: rootNode});

      let hash = this.generateHash(rootNode)
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
    //console.log('clickHandler!');
    let eventType = event.name;

    if( eventType === 'reset') {
      // Reset the sketch view

      //this.setState({selectedNode: this.state.rootNode});
      this.selectNode(this.state.rootNode);
      this.setState({splitPaneSize: "100%"});

    }else if( eventType === 'add') {
      // Add a new child node
      this.addChild(event.source);
    }else if( eventType === 'detail') {
      // Display editable properties of a node

      let node = this.state.treeHash[event.source];
      //this.setState({selectedNode: node});
      this.selectNode(node);
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
    if( selectedNode && selectedNode.type != 'root') {

      let parentNode = this.state.treeHash[selectedNode.parentId];

      // If there are operations waiting to be saved, send them to the backend now
      this.delayedNodeUpdate.flush()
      .then( () => {
        // Make the delete request
        Backend.deleteNode(this.props.userObject.token,
          this.props.projectId,
          this.props.sketchIteration,
          selectedNode.id)
      }).then( (result) => {
        //console.log('result: ', result);
        // Get the updated tree and render it again
        return Backend.getSketch(this.props.userObject.token, this.state.sketchId);
      }).then( result => {

        // First select the parent node of the node that was deleted
        this.selectNode(parentNode);

        // Update the tree
        this.initializeTree(result.sketch, parentNode);

        //TODO: Alert the user that the node has been deleted

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
      this.setState({selectedNode: this.state.rootNode});
      this.hideDetailPane();
    }

    if( document.activeElement != null && document.activeElement.localName != 'body') {
      // The user is probably focused on an input field, so don't do anything with
      // keys
      return;
    }

    if(event.key === '+') {
      let selectedNode = this.state.selectedNode;
      this.addChild(selectedNode.id);
    }else if( event.key === 'Delete') {
      let selectedNode = this.state.selectedNode;
      if( selectedNode && selectedNode.type != 'root') {
        // Popup a confirmation modal
        $('#deleteConfirmationModal').modal();
      }
    }else if(event.key === 'ArrowLeft') {
      // Try to move to the parent node
      let selectedNode = this.state.selectedNode;
      if( selectedNode.type === 'root') { return; }
      let parent = this.state.treeHash[selectedNode.parentId];
      //this.setState({selectedNode: parent});
      this.selectNode(parent);
    }else if( event.key === 'ArrowRight') {
      // Try to move to a child node
      let selectedNode = this.state.selectedNode;
      if(selectedNode.children.length > 0 ) {
        // Move to the middle child
        let index = Math.ceil(selectedNode.children.length / 2);
        //this.setState({selectedNode: selectedNode.children[index-1]});
        this.selectNode(selectedNode.children[index-1]);
      }
    }else if( event.key === 'ArrowDown') {
      // Try to move to the next sibling
      let selectedNode = this.state.selectedNode;
      if( selectedNode.type === 'root') { return; }
      let parent = this.state.treeHash[selectedNode.parentId];
      for( let i = 0; i < parent.children.length; i++) {
        let childNode = parent.children[i];
        if( childNode.id === selectedNode.id) {
          if( (i + 1) < parent.children.length ) {
            this.setState({selectedNode: parent.children[i+1]});
          }
          return;
        }
      }

    }else if( event.key === 'ArrowUp' ) {
      // Try to move to the previous sibling
      let selectedNode = this.state.selectedNode;
      if( selectedNode.type === 'root') { return; }
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

    let prePath = '';
    if( this.state.selectedNode && this.state.selectedNode.type !== 'root') {
      prePath = this.state.treeHash[this.state.selectedNode.parentId].fullpath;
    }

    let EditPane =  this.state.selectedNode ?
      <NodeEditor
        vocabulary={this.state.vocabulary}
        node={this.state.selectedNode}
        prePath ={prePath}
        uriChangeHandler={(id,val)=>{this.uriChanged(id,val)}}
        dataChangeHandler={(id,key,fields)=>{this.dataChanged(id,key,fields)}}
        /> : <div/>;

      const buttonPanelStyle = {
        display: this.state.butttonpanel_display
      };
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
          <VocabularyList vocabulary={this.state.vocabulary}/>
        </div>

        <div className="main-content">
          <div className="sketch-canvas">
            <SplitPane
              split="horizontal"
              size={this.state.splitPaneSize}
              minSize={100}>
              <div className="svg-wrapper">
                <div id="button panel" className="buttonpanel" style={buttonPanelStyle}>
                  <button
                    id="delete-node-btn"
                    onClick={(e) => {
                      $('#deleteConfirmationModal').modal();
                      // Stop propagation so that the svg does not get called
                      //e.stopPropagation();
                    }}
                    className="btn btn-danger">Delete Node</button>
                </div>

                <CRUDTree
                  rootNode={this.state.rootNode}
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
