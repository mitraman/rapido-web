import React from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import * as Ace from 'brace';

import 'brace/mode/javascript';
import 'brace/theme/github';

export default class extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      selectedMethodIndex: 0,
      activeTab: 'get',
      tabClasses: {get: 'active'},
      data: {},
      methodEnabled: {}
    }
  }

  resetView() {
    this.manipulatingBuffer = true;
    this.editor.setValue(this.state.data.get);
    this.manipulatingBuffer = false;
    this.setState({tabClasses: {get: 'active'}});
    this.setState({activeTab: 'get'});
  }

  loadResponseData(node) {

    let getValue = node.responseData.get ? node.responseData.get : '';
    let putValue = node.responseData.put ? node.responseData.put : '';
    let patchValue = node.responseData.patch ? node.responseData.patch : '';
    let postValue = node.responseData.post ? node.responseData.post : '';
    let deleteValue = node.responseData.delete ? node.responseData.delete : '';

    let responseData = {
      'get': getValue,
      'put': putValue,
      'patch': patchValue,
      'post': postValue,
      'delete': deleteValue
    }

    // Store the response data and set the editor tab to 'get'
    this.setState({data: responseData}, () => {this.resetView()});
  }

  shouldComponentUpdate(nextProps) {
    return true;
  }

  componentWillReceiveProps(nextProps){
    // If there has been a change in props, update the editor state
    if( this.props.node !== nextProps.node ) {
      let node = nextProps.node;
      if( !node ) {
        throw new Error('No node passed to <ResponseEditor/>');
      }

      this.loadResponseData(node);
    }
  }

  componentDidMount() {

    // Setup the editor
    this.editor = ace.edit(this.editDiv);
    this.editor.setTheme("ace/theme/github");
    this.editor.getSession().setMode("ace/mode/javascript");
    this.editor.on("change", (e) => {this.onChange(e)});
    this.editor.$blockScrolling = Infinity;

    let node = this.props.node;
    if( !node ) {
      throw new Error('No node passed to <ResponseEditor/>');
    }

    this.loadResponseData(node);
  }

  onChange(e) {
    // Don't do anything if the change is a result of our code.
    if( this.manipulatingBuffer) return;

    let data = this.state.data;
    data[this.state.activeTab] = this.editor.getValue();
    this.setState({data: data});

    // Set a timer - we won't send these changes to the backend  unless a duration has passed without any more changes
    const intervalTime = 3000;
    if(this.timeoutID) {
      // Cancel the last timeout
      window.clearTimeout(this.timeoutID);    }
    this.timeoutID = window.setTimeout(() => {
      this.props.updateHandler(this.state.data);
    }, intervalTime)
  }

  tabSelected(event) {
    this.manipulatingBuffer = true;
    // Set the active tab
    let tabClasses = {}
    let methodName = event.target.name;
    tabClasses[methodName] =  'active';
    this.setState({tabClasses: tabClasses});
    this.setState({activeTab: methodName});

    // Set the editor body based on the active tab
    let data = this.state.data[methodName] ? this.state.data[methodName] : '';
    this.editor.setValue(data);
    this.manipulatingBuffer = false;

  }

  render() {

    let editorStyle = {
      width: '100%',
      height: '100%'
    }

    return (
        <div className="response-edit">
          <ul className="nav nav-tabs">
            <li role="presentation" className={this.state.tabClasses.get}><a name="get" href="#" onClick={(e) => {this.tabSelected(e)}}>GET</a></li>
            <li role="presentation" className={this.state.tabClasses.put}><a name="put" href="#" onClick={(e) => {this.tabSelected(e)}}>PUT</a></li>
            <li role="presentation" className={this.state.tabClasses.post}><a name="post" href="#" onClick={(e) => {this.tabSelected(e)}}>POST</a></li>
            <li role="presentation" className={this.state.tabClasses.patch}><a name="patch" href="#" onClick={(e) => {this.tabSelected(e)}}>PATCH</a></li>
            <li role="presentation" className={this.state.tabClasses.delete}><a name="delete" href="#" onClick={(e) => {this.tabSelected(e)}}>DELETE</a></li>
          </ul>
          <div id="editorpane" style={editorStyle} ref={(e) => { this.editDiv = e} }></div>
        </div>
      );
    }
}
