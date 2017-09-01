export default class {

  constructor() {
  }

  parseJSON(json, vocabulary) {
    Object.keys(json).forEach(key => {
      if( vocabulary.indexOf(key) < 0) {
        vocabulary.push(key);
      }
      if( typeof json[key] === 'object'){
        if( Array.isArray(json[key])) {
          json[key].forEach(arrayItem => {
              if( typeof arrayItem === 'object' && !Array.isArray(arrayItem)) {
                this.parseJSON(arrayItem, vocabulary);
              }
          })
        }else {
          this.parseJSON(json[key], vocabulary);
        }
      }
    })
  }
  parseJSONString(raw, vocabulary) {
    try {
      let json = JSON.parse(raw);
      this.parseJSON(json, vocabulary);
    }catch( e ) {
      if( e instanceof SyntaxError) {
        // This is not legal JSON, so ignore it
        //console.log('invalid json');
      }else {
        console.log('error:',e);
      }
    }
  }

    parseNode(node, vocabulary) {
      if(!node){ return; }
      if( vocabulary.indexOf(node.name) < 0 ) {
          vocabulary.push(node.name);
      }
      if( node.data ) {
        Object.keys(node.data).forEach(methodName => {
          let methodData = node.data[methodName];
          if(methodData.request && methodData.request.body) {
            if( methodData.request.contentType === 'application/json') {
              this.parseJSONString(methodData.request.body, vocabulary);
            }else {
              // This is not JSON, how should we parse it?
            }
          }
          if(methodData.response && methodData.response.body) {
            if( methodData.response.contentType === 'application/json') {
              this.parseJSONString(methodData.response.body, vocabulary);
            }else {
              // This is not JSON, how should we parse it?
            }
          }
        })
      }

    // Parse child nodes
    if(node.children) {
      node.children.forEach(child => {
        this.parseNode(child, vocabulary);
      })
    }
  }

  parseTree(rootNode) {
    let vocabulary = [];
    this.parseNode(rootNode, vocabulary);
    return vocabulary;
  }
}
