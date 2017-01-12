import React from 'react'
import  CanvasExample from './CanvasExample'


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
    treeData: {
      "id": 0,
      "name": "API",
      "children": [
        { "id" : 1, "name" : "projects"}
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
          { "id": 1, "name": "projects"},
          { "id": 2, "name": "groups"},
          { "id": 3, "name": "users",
            "children": [
              {"id": 4, "name": "{id}"}
            ]}
        ]
      }
    });
  },
  render() {
    return (
      <div>
        <CRUDCanvas
          data={[this.state.treeData]}
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
    )
  }
})
