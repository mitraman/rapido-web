var Promise = require("bluebird");


export default class {

  static _authenticatedCall(token, method, url, body, responseHandler, parseJSONarg) {
    let parseJSON = (typeof parseJSONarg !== 'undefined') ? parseJSONarg : true;
    const baseUrl = __BACKEND;
    let path = baseUrl + url;
    return new Promise( function(resolve, reject ) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, path);
      xhr.setRequestHeader('Content-Type', 'application/json');
      if( token ) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      }
      // Set a timeout of 3 seconds
      xhr.timeout = 3000;

      xhr.onreadystatechange = function() {//Call a function when the state changes.
        if(xhr.readyState == XMLHttpRequest.DONE) {
          //console.log('received response');
          // Request finished. Do processing here.
          if( xhr.status >= 200 && xhr.status <= 299 ) {
            if(!parseJSON || xhr.status === 204) {
              resolve(xhr.response);
            } else {
              let responseBody = JSON.parse(xhr.response);
              //console.log(responseBody);
              resolve(responseHandler(responseBody));
            }
          } else {
            let contentType = xhr.getResponseHeader('Content-Type');
            //console.log(contentType);
            if( contentType && contentType.startsWith('application/problem+json')) {
              reject(JSON.parse(xhr.response));
            }else {
              console.log('unexpected response from server: ', xhr);
              let problem = {
                detail: 'Unexpected problem encountered'
              }
              reject(problem);
            }
            //console.log('non 200 status: ', xhr.status);

          }
        }
      }

      if( body ) {
        xhr.send(JSON.stringify(body));
      }else {
        xhr.send();
      }

    });
  }

  static _call(method, url, body, responseHandler) {
    return this._authenticatedCall(null, method, url, body, responseHandler);
  }

  static register(user) {
    const body = {
      fullname: user.fullName,
      nickname: "",
      password: user.password,
      email: user.email
    }

    return this._call("POST", "/api/register", body, function(responseBody){
      return {
        id: responseBody.id
      };
    })
  }

  static login(user) {
    const body = {
        email: user.email,
        password: user.password
    }

    return this._call("POST", "/api/login", body, function(responseBody) {
      return {
        token: responseBody.token,
        userId: responseBody.userId,
        fullName: responseBody.fullName,
        email: responseBody.email,
        nickName: responseBody.nickName
      };
    })
  }

  static getProjects(token) {

    return this._authenticatedCall(token, "GET", "/api/projects", null, function(responseBody) {
      return {
        projects: responseBody.projects
      };
    })
  }

  static createProject(token, project) {
    const body = {
      name: project.name,
      description: project.description,
      style: project.style
    }
    return this._authenticatedCall(token, "POST", "/api/projects", body, function(responseBody) {
      return {
        id: responseBody.project.id
      };
    })
  }


  static getProject(token, projectId) {
    let projectUrl = '/api/projects/' + projectId;

    return this._authenticatedCall(token, "GET", projectUrl, null, function(responseBody) {
      return {
        project: responseBody.project
      };
    })
  }

  static getSketch(token, sketchId) {
    let sketchUrl = '/api/sketch/' + sketchId;

    return this._authenticatedCall(token, "GET", sketchUrl, null, function(responseBody) {
      return {
        sketch: responseBody.sketch
      };
    })
  }


  static addChildNode(token, projectId, sketchId, parentId) {
    let url = '/api/projects/' + projectId + '/sketches/' + sketchId + '/nodes'
    if( parentId ) {
        url = url + '/' + parentId;
    }

    return this._authenticatedCall(token, "POST", url, null, function(responseBody) {
      return {
        node: responseBody.node,
        rootNode: responseBody.rootNode
      }
    });
  }

  static updateNode(token, projectId, sketchId, nodeId, updateObject) {
    let url = '/api/projects/' + projectId + '/sketches/' + sketchId + '/nodes/' + nodeId;

    // let updateObject = {
    //   name: node.name,
    //   fullpath: node.fullpath
    // }

    //console.log('updateObject:', updateObject);
    //console.log(url);

    return this._authenticatedCall(token, "PATCH", url, updateObject, function(responseBody) {
      return {
        node: responseBody.node,
        rootNode: responseBody.rootNode
      }
    });
  }

  static deleteNode(token, projectId, sketchId, nodeId) {
    let url = '/api/projects/' + projectId + '/sketches/' + sketchId + '/nodes/' + nodeId;

    return this._authenticatedCall(token, "DELETE", url, null, function(responseBody) {
      return {
        node: responseBody.node,
        rootNode: responseBody.rootNode
      }
    });
  }

  static export(token, projectId, sketchIndex, format) {
    let url = '/api/projects/' + projectId + '/sketches/' + sketchIndex + '/export?format='+format;
    return this._authenticatedCall(token, "GET", url, null, function(responseBody) {
      //console.log('responseBody:', responseBody);
      return responseBody;
    }, false);
  }


}
