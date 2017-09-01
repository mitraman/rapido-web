import React from 'react'
import ReactDOM from 'react-dom'
import AlertContainer from 'react-alert'
import RapidoErrorCodes from '../error/codes.js';
import Backend from '../../adapter/Backend.js';
import brace from 'brace';
import * as Ace from 'brace';

import 'brace/mode/yaml';
import 'brace/theme/github';

export default class extends React.Component{

  constructor(props) {
      super(props);
      console.log('Export constructor');
      this.state = {
        formatName: 'Open API Specification 2.0 (Swagger)',
        format: 'oai2',
        mode: 'yaml',
        data: 'not loaded.'
      };
  }

  componentWillMount() {
    // Call the backend and get the export data
    // static export(token, projectId, sketchIndex, format) {
    Backend.export(this.props.userObject.token, this.props.projectId, this.props.sketchIteration, this.state.format)
    .then( result => {
      // Display the exported data
      //console.log(result);
      this.setState({data: result});
    }).catch( e => {
      console.log('Unable to retrieve export data:', e);
    });
  }

  componentDidMount() {
    // Setup the editor
    this.dataEditor = ace.edit(this.exportDataDiv);
    this.dataEditor.setTheme("ace/theme/github");
    this.dataEditor.getSession().setMode("ace/mode/yaml");
    this.dataEditor.$blockScrolling = Infinity;
    this.dataEditor.setValue(this.state.data);
    // this.dataEditor.setOptions({
    //   readOnly: true,
    // })
  }

  componentDidUpdate(nextProps, nextState) {
    this.dataEditor.setValue(this.state.data);
  }



  /* Render Method */
  render() {
    let editorStyle = {
      width: '100%',
      height: '100%'
    }

    return(
      <div id="ExportModal">
        <div>{this.state.formatName}</div>
        <div id="data" style={editorStyle} ref={(e) => { this.exportDataDiv = e} }></div>
      </div>
    )
  }
}
