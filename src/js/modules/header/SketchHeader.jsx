import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Backend from '../../adapter/Backend.js';
import '../../../css/header.scss'
import 'bootstrap/dist/js/bootstrap';
import Modal from '../Modal.jsx'
import RapidoErrorCodes from '../error/codes.js';
import LoginService from '../login/LoginService.js';


export default class extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      routeExport: false,
      newProjectRoute: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    // Reset project redirection
    this.setState({newProjectRoute: false});
    this.setState({routeExport: false});
  }

  export() {
    //console.log('export clicked');
    this.setState({routeExport: true});
  }

  createSketch() {
    Backend.createSketch(this.props.userInfo.token, this.props.project.id)
    .then( result => {
      // select the new sketch
      this.selectSketch(result.sketch.index);
    }).catch( e => {
      // TODO: Show an alert if there was a problem creating the sketch
      if( e.name === 'RapidoError') {

      }
    })
  }

  selectSketch(sketchIndex) {
    this.setState({newProjectRoute: '/project/1/sketch/' + sketchIndex});
  }

  createSketchList() {
    let sketches = [];
    if(!this.props.project.sketches) {
      return sketches;
    }

    this.props.project.sketches.forEach( (sketch, index) => {
      //if( index === this.props.)
      sketches.push(<li key={index} id={index}><a href="#" onClick={() => this.selectSketch(index+1)}>Sketch {index+1}</a></li>);
    })
    return sketches;
  }


  //TODO: Use a componant for the result modal
  render() {

    if(this.state.newProjectRoute) {
      //console.log('redirecting to :', this.state.newProjectRoute);
      return <Redirect push to={this.state.newProjectRoute}/>
    }

    if(this.state.routeExport) {
      let url = '/project/' + this.props.project.id + '/sketch/' + this.props.sketchIndex + '/export';
      return <Redirect push to={url}/>;
    }

    let sketchList = '';


    return (
      <span id="sketch-header">
        <h3 className="navbar-text"><span className="label label-default">{this.props.project.name}</span></h3>
        <ul className="nav navbar-nav">
          <li className="dropdown">
        <a id="userProfileMenu"
          className="navbar-link userProfile"
          data-target="#"
          data-toggle="dropdown"
          role="button" aria-haspopup="true" aria-expanded="false">Sketch {this.props.sketchIndex} <span className="caret"></span></a>
          <ul className="dropdown-menu" aria-labelledby="userProfileMenu">
            {this.createSketchList()}
          </ul>
          </li>
        </ul>
        <button type="button" className="btn btn-success navbar-btn sketch-btn" id="create-sketch" onClick={(e)=>{this.createSketch(e)}}>New Sketch!</button>
        <button type="button" className="btn btn-default nabvar-btn export-btn" id="export" onClick={(e)=>{this.export(e)}}>Export</button>
      </span>
    )
  }
}
