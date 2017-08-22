import React from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import * as Ace from 'brace';

import SplitPane from 'react-split-pane';
import BootstrapToggle from 'bootstrap-toggle';

import 'brace/mode/javascript';
import 'brace/theme/github';

import 'bootstrap-toggle/css/bootstrap-toggle.min.css';

export default class extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      selectedMethodIndex: 0,
      activeTab: 'get',
      tabClasses: {get: 'active'},
      methodLabels: {
        get: 'label get disabled',
        put: 'label put disabled',
        post: 'label post disabled',
        patch: 'label patch disabled',
        delete: 'label delete disabled'
      },
      data: {},
      isMethodEnabled: false
    }
  }

  // Sets the contents of all inputs for a method
  setView(methodName) {
    let tabClasses = {}
    tabClasses[methodName] =  'active';
    this.setState({tabClasses: tabClasses});
    this.setState({activeTab: methodName});
    this.setState({isMethodEnabled: this.state.data[methodName].enabled});
    this.setState({requestParams: this.state.data[methodName].request.queryParams})
    this.setState({statusCode: this.state.data[methodName].response.status})

    this.manipulatingBuffer = true;
    if( this.state.data[methodName] ) {
      this.responseEditor.setValue(this.state.data[methodName].response.body, 1);
      this.requestEditor.setValue(this.state.data[methodName].request.body, 1);
    }else {
      this.responseEditor.setValue('', 1);
      this.responseEditor.setValue('', 1);
    }
    this.manipulatingBuffer = false;

  }

  // Sets the state of the method label classes based on whether they are enabled
  setMethodLabelClass(methodName) {
    let classValue = 'label ' + methodName;
    if( this.state.data[methodName].enabled === false ) {
      classValue = classValue + ' disabled';
    }
    let methodLabels = this.state.methodLabels;
    methodLabels[methodName] = classValue;
    this.setState({methodLabels: methodLabels});
  }

  // Loads editor state values based on node data
  loadNodeData(node) {
    let buildMethodData = function(methodName, data) {
      return {
        enabled: (data[methodName] ? data[methodName].enabled : false),
        request: {
          contentType : ( data[methodName] ? data[methodName].request.contentType : 'application/json'),
          queryParams : ( data[methodName] ? data[methodName].request.queryParams : ''),
          body : ( data[methodName] ? data[methodName].request.body : '' )
        },
        response: {
          contentType : ( data[methodName] ? data[methodName].response.contentType : 'application/json'),
          status : ( data[methodName] ? data[methodName].response.status : '' ),
          body : ( data[methodName] ? data[methodName].response.body : '' )
        }
      };
    }

    let data = {
      'get': buildMethodData('get', node.data),
      'put': buildMethodData('put', node.data),
      'patch': buildMethodData('patch', node.data),
      'post': buildMethodData('post', node.data),
      'delete': buildMethodData('delete', node.data)
    }

    // Store the message body data and set the editor tab to 'get'
    this.setState({data: data}, () => {
      this.setView('get')

      // Set the classnames for all method labels
      this.setMethodLabelClass('get');
      this.setMethodLabelClass('put');
      this.setMethodLabelClass('post');
      this.setMethodLabelClass('delete');
      this.setMethodLabelClass('patch');

    });



  }

  componentWillReceiveProps(nextProps){
    // If there has been a change in props, update the editor state
    if( this.props.node !== nextProps.node ) {
      let node = nextProps.node;
      if( !node ) {
        throw new Error('No node passed to <ResponseEditor/>');
      }
      this.loadNodeData(node);
    }
  }

  componentDidMount() {

    // Setup the editor
    this.responseEditor = ace.edit(this.responseEditDiv);
    this.responseEditor.setTheme("ace/theme/github");
    this.responseEditor.getSession().setMode("ace/mode/javascript");
    this.responseEditor.on("change", (e) => {this.onEditorChange(e, 'responseBody')});
    this.responseEditor.$blockScrolling = Infinity;

    this.requestEditor = ace.edit(this.requestEditDiv);
    this.requestEditor.setTheme("ace/theme/github");
    this.requestEditor.getSession().setMode("ace/mode/javascript");
    this.requestEditor.on("change", (e) => {this.onEditorChange(e, 'requestBody')});
    this.responseEditor.$blockScrolling = Infinity;

    let node = this.props.node;
    if( !node ) {
      throw new Error('No node passed to <BodyEditor/>');
    }

    this.loadNodeData(node);
  }

  onFieldChange(e) {
    if( e.target.name === 'requestParams') {
      this.setState({requestParams: e.target.value});
      this.props.updateHandler(this.state.activeTab,
        { request: { queryParams: e.target.value }} );
    }else if( e.target.name === 'statusCode') {
      this.setState({statusCode: e.target.value});
      this.props.updateHandler(this.state.activeTab,
        { response: { status: e.target.value } } );
    }
  }

  onEditorChange(e, editorName) {
    // Don't do anything if the change is a result of our code.
    if( this.manipulatingBuffer) return;

    let data = this.state.data;
    //data[this.state.activeTab] = this.responseEditor.getValue();
    if( editorName === 'responseBody') {
      // If the response body was empty, automatically enable this method
      if( data[this.state.activeTab].response.body.length === 0  ) {
        /*
        this.setState({isMethodEnabled: true});
        data[this.state.activeTab].enabled = true;
        this.props.updateHandler(this.state.activeTab, {enabled: true});
        */
        this.handleEnabledChange();
      }
      data[this.state.activeTab].response.body = this.responseEditor.getValue();
    }else if( editorName === 'requestBody' ) {
      data[this.state.activeTab].request.body = this.requestEditor.getValue();
    }

    // Store the changes in state
    this.setState({data: data});

    //TODO: we should just push the event up and let the parent deal with the timer
    // Set a timer - we won't send these changes to the backend  unless a duration has passed without any more changes
    const intervalTime = 3000;
    if(this.timeoutID) {
      // Cancel the last timeout
      window.clearTimeout(this.timeoutID);    }
    this.timeoutID = window.setTimeout(() => {
      this.props.updateHandler(this.state.activeTab, this.state.data[this.state.activeTab] );
    }, intervalTime)
  }

  // Called when the enbaled checkbox is changed
  handleEnabledChange() {
    let newCheckBoxState = !this.state.isMethodEnabled;
    this.setState({isMethodEnabled: newCheckBoxState});
    this.props.updateHandler(this.state.activeTab, {enabled: newCheckBoxState })

    // Update the method class Labels
    let data = this.state.data;
    let methodName = this.state.activeTab;
    data[this.state.activeTab].enabled = newCheckBoxState;
    this.setState({data: data}, () => {
      this.setMethodLabelClass(this.state.activeTab);
    })
  }

  // Called when the user selects a method tab
  tabSelected(event) {
    // Set the active tab

    // Set the enabled checkbox state
    //let enabledState = this.

    // Set the editor body based on the active tab
    // Using currentTarget so we get the A tag instead of the SPAN
    this.setView(event.currentTarget.name);

  }

  render() {

    let requestEditorStyle = {
      width: '600px',
      height: '100%'
    }

    let requestPanelStyle = {
      float: 'left'
    }

    let responsePanelStyle = {
      marginLeft: '630px'
    }

    let editorStyle = {
      width: '600px',
      height: '100%'
    }
    // let editorStyle = {
    //   width: '800px',
    //   height: '150px'
    // }

    //<div id="requestEditorPane" style={editorStyle} ref={(e) => { this.requestEditDiv = e} }></div>

    return (
        <div className="response-edit">
          <ul className="nav nav-tabs">
            <li role="presentation" className={this.state.tabClasses.get}>
              <a name="get" href="#" onClick={(e) => {this.tabSelected(e)}}><span className={this.state.methodLabels.get}>GET</span></a>
            </li>
            <li role="presentation" className={this.state.tabClasses.put}>
              <a name="put" href="#" onClick={(e) => {this.tabSelected(e)}}><span className={this.state.methodLabels.put}>PUT</span></a>
            </li>
            <li role="presentation" className={this.state.tabClasses.post}>
              <a name="post" href="#" onClick={(e) => {this.tabSelected(e)}}><span className={this.state.methodLabels.post}>POST</span></a>
            </li>
            <li role="presentation" className={this.state.tabClasses.patch}>
              <a name="patch" href="#" onClick={(e) => {this.tabSelected(e)}}><span className={this.state.methodLabels.patch}>PATCH</span></a>
            </li>
            <li role="presentation" className={this.state.tabClasses.delete}>
              <a name="delete" href="#" onClick={(e) => {this.tabSelected(e)}}><span className={this.state.methodLabels.delete}>DELETE</span></a>
            </li>
          </ul>
          <div id="enabled">
            <input
              name="isMethodEnabled"
              type="checkbox"
              checked={this.state.isMethodEnabled}
              data-toggle="toggle"
              onChange={() => this.handleEnabledChange()}>
            </input>
            <label onClick={() => this.handleEnabledChange()}>Enabled</label>
          </div>

          <SplitPane split="vertical" minSize={50} defaultSize={"50%"}>
            <div>
              <h4>Request</h4>
              <form className="form">
                <div className="form-group">
                  <label>Request Parameters: </label>
                  <input
                    className="form-control input-sm"
                    name="requestParams"
                    placeholder="?[key]=[value]&"
                    type="text"
                    value={this.state.requestParams}
                    onChange={(e) => this.onFieldChange(e)}/>
                </div>
                <label>Content Type:</label>
                <select className="form-control input-sm" readOnly>
                  <option>application/json</option>
                </select>

              </form>
              <div id="requestEditorPane" style={requestEditorStyle} ref={(e) => { this.requestEditDiv = e} }></div>
              </div>
            <div>
              <h4>Response</h4>
              <form className="form">
              <div className="form-group">
                <label>Status Code:</label>
                <input
                  className="form-control input-sm"
                  name="statusCode"
                  placeholder="Default Status Code"
                  type="text"
                  value={this.state.statusCode}
                  onChange={(e) => this.onFieldChange(e)}/>
              </div>
              <label>Content Type:</label>
              <select className="form-control input-sm" readOnly>
                <option>application/json</option>
              </select>

              </form>
              <div id="responseEditorPane" style={editorStyle} ref={(e) => { this.responseEditDiv = e} }></div>

            </div>
          </SplitPane>
        </div>
      );
    }
}
