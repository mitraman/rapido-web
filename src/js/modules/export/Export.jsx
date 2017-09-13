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
      //console.log('Export constructor');
      this.state = {
        format: 'oai2',
        data: 'not loaded.'
      };
  }

  componentWillMount() {
    // console.log('export componentWillMount');
    // console.log('sketchIteration:', this.props.sketchIteration);
    // Call the backend and get the export data
    // static export(token, projectId, sketchIndex, format) {
    Backend.export(this.props.userObject.token, this.props.projectId, this.props.sketchIteration, this.state.format)
    .then( result => {
      // Display the exported data
      this.setState({data: result});

    }).catch( e => {
      console.log('Unable to retrieve export data:', e);
    });
  }

  componentDidMount() {
    // console.log('export componentDidMount');
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
    this.dataEditor.setValue(this.state.data, -1);
  }

  handleFormatChange(e) {
    let format = e.target.value

    Backend.export(this.props.userObject.token, this.props.projectId, this.props.sketchIteration, format)
    .then( result => {
      // Display the exported data
      this.setState({data: result});
      this.setState({format: format});
    }).catch( e => {
      console.log('Unable to retrieve export data:', e);
    });
  }

  listFormats() {
    let formats = [];
    formats.push(<option key="1" value="1">1</option>);
    formats.push(<option key="2" value="2">2</option>);
    return formats;
  }


  /* Render Method */
  render() {
    let editorStyle = {
      width: '100%',
      height: '100%'
    }

    return(
      <div id="Export">
        <div className="row">
          <select className="form-control" onChange={(e)=>this.handleFormatChange(e)}>
            <option selected value="oai2">OpenAPI Specification 2.0</option>
            <option value="oai3">OpenAPI Specification 3.0</option>
          </select>
        </div>
        <div className="row">
        <div id="data" style={editorStyle} ref={(e) => { this.exportDataDiv = e} }></div>
        </div>
      </div>
    )
  }
}
