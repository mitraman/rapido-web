import React from 'react'
import AceEditor from 'react-ace'


function onChange(newValue) {

}

export default React.createClass({
  render() {
    console.log(this.props.params.nodeId);
    return (
      <div>
        <AceEditor
          mode="json"
          theme="github"
          onChange={onChange}
          name="property-editor"
          editorProps={{$blockScrolling: true}}
          />,
      </div>
    )
  }
})
