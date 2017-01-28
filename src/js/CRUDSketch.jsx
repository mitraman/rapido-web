import React from 'react'
import ReactDOM from 'react-dom'
import CRUDTree from './CRUDTree'
import EditObserver from './EditObserver'
import { browserHistory } from 'react-router'

var component;

export default class extends React.Component{

  onClick(event) {
    if( event.name === "detail" ) {
      let source = event.source;
      if( source ) {

        // navigate to the node editor
        const path = '/nodes/' + source;
        browserHistory.push(path);

        //TODO: this should be triggered whenever the edit view is mounted, so that
        // it gets called on a reload.

        //TODO: determine the offset based on the actual div width
        let offset = 500;

        // shrink the size of the sketch div
        component.setState({canvasHeight: 150});

        console.log(event.y);

        // move the canvas so the source node is targeted
        component.setState({offsetX: (-event.x + offset)});
        component.setState({offsetY: (-event.y + 10)});



      } else {
        console.log.warn("Invalid node ID: " + source);
      }
    }
  }

  constructor(props) {
    super(props);

    component = this;

    this.state = {
      editing: false,
      canvasHeight: "100%",
      offsetX: 50,
      offsetY: 0,
      treeData: {
        "id": 0,
        "name": "API",
        "children": [
          { "id" : 1,
            "name" : "projects",
            "url": "/projects",
            "fullpath": "/projects",
            "get": true,
            "children": [
              {
                "id" : 4,
                "name" : "{id}}",
                "url": "{id}",
                "fullpath": "/projects/{id}",
                "get": true,
                "put": true
              }
            ]
          },
          { "id" : 2,
            "name" : "groups",
            "url": "/groups",
            "fullpath": "/groups",
            "get": true
          },
        ]
      }
    }

    // add an observer for the child edit view
    let observer = new EditObserver();
    observer.addObserver(function(event) {
      console.log(event.id);
      if( event.id === "closeeditor" ) {
        // reset the view
        component.setState({offsetX: 50, offsetY: 0, canvasHeight: "100%"});
      }
    })
  }

  render() {

    return (
      <div className="row">
      <div>
        <CRUDTree
          data={
            [
              this.state.treeData,
              this.onClick,
              {
                x: this.state.offsetX,
                y: this.state.offsetY }
            ]}
          width={"100%"} height={this.state.canvasHeight}
          options={ {
            border: "2px solid black",
            margin: {
                top: 0,
                bottom: 0,
                left: 50,
                right: 0
            } }
          }/>
      </div>
      <div>
        {this.props.children}
      </div>
      </div>
    )
  }
}
