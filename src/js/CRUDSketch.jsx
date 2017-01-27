import React from 'react'
import CRUDTree from './CRUDTree'
import { browserHistory } from 'react-router'


// create an event handler for actions on CRUD nodes
class ClickHandler {
  fire(event, source) {
    if( event === "detail" ) {
      if( source ) {
        const path = '/nodes/' + source;
        browserHistory.push(path);
      }else {
        console.log.warn('Invalid node ID:' + source);
      }
    } else if( event === "add" ) {

    }
  }
}

class ChangeDataButton extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <button onClick={this.props.onClick}>Press Me!</button>
    );
  }
}

class RadiusInput extends React.Component {
  constructor() {
     super();
     this.state = {
       aRadius: 10
     };
     this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.setState({aRadius: event.target.value});
    this.props.onRadiusChange(event.target.value);
  }

  render() {
    return (
      <input type="text" onChange={this.handleChange} value={this.state.aRadius}></input>
    );
  }
}

export default React.createClass({
  getInitialState() {
    return {
    editing: false,
    treeData: {
      "id": 0,
      "name": "API",
      "children": [
        { "id" : 1, "name" : "projects", "url": "/projects", "fullpath": "/projects", "get": true}
      ]
    }
    };
  },
  onDataChange: function() {
    // Change the treeData
    console.log('click');
    this.setState({
      treeData: {
        "id": 0,
        "name": "API",
        "children": [
          { "id": 1, "name": "projects", "url": "/projects", "fullpath": "/projects"},
          { "id": 2, "name": "groups", "url": "/groups", "fullpath": "/groups"},
          { "id": 3, "name": "users", "url": "/users", "fullpath": "/users",
            "children": [
              {"id": 4, "name": "{id}", "url": "{id}", "fullpath": "/users/{id}"}
            ]}
        ]
      }
    });
  },
  render() {
    return (
      <div className="row">
      <div>
        <CRUDTree
          data={[this.state.treeData, new ClickHandler()]}
          width={1000} height={600}
          options={ {
            border: "2px solid black",
            margin: {
                top: 0,
                bottom: 0,
                left: 50,
                right: 0
            } }
          }/>

          <div>
            <ChangeDataButton onClick={this.onDataChange}/>
          </div>
      </div>
      <div>
        {this.props.children}
      </div>
      </div>
    )
  }
})
