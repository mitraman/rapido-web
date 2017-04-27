import React from 'react'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/js/bootstrap';
import 'typeahead.js/dist/typeahead.bundle.min.js';
import 'typeahead.js/'

/**
Example of shallow testing a typeahead box from a parent component:
it('should render a typeahead project name field in the form', function() {
  const wrapper = shallow(<ProjectForm/>);
  let typeAheadInputs = wrapper.find(TypeAheadTextInput);
  const projectNameInput = typeAheadInputs.findWhere(n => n.props().name === 'projectName');
  expect(projectNameInput.length).toBe(1)
})
**/

export default class extends React.Component{

  constructor(props) {
    super(props)

    this.dataSource = this.dataSource.bind(this);
  }

  dataSource(query, syncResults, asyncResults) {

    let matches, substrRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(query, 'i');
    //console.log(substrRegex);

    let words = this.props.words;

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    for(let i = 0; i < words.length; i++ ) {
      let word = words[i];
      if(substrRegex.test(word)) {
        matches.push(word);
      }
    }

    syncResults(matches);
  }

  componentDidMount() {

    $('#typeahead-text .typeahead').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'blah',
      source: this.dataSource
    });
  }

  render() {
    return (
      <div className="typeahead-text" id="typeahead-text">
        <input type="text"
          name={this.props.name}
          id={this.props.id}
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={this.props.onChange}
          required={this.props.required}
          className="typeahead form-control"></input>
      </div>
    )
  }

}
