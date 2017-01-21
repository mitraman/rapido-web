import React from 'react'
import AceEditor from 'react-ace'


function onChange(newValue) {

}

export default React.createClass({
  render() {
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
