var Promise = require("bluebird");


export default class {

  static _call(method, url, body, responseHandler) {
    const baseUrl = __BACKEND;
    let path = baseUrl + url;
    return new Promise( function(resolve, reject ) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, path);
      xhr.setRequestHeader('Content-Type', 'application/json');

      // Set a timeout of 3 seconds
      xhr.timeout = 3000;

      xhr.onreadystatechange = function() {//Call a function when the state changes.
        if(xhr.readyState == XMLHttpRequest.DONE) {
          //console.log('received response');
          // Request finished. Do processing here.
          if( xhr.status === 200 ) {
            let responseBody = JSON.parse(xhr.response);
            //console.log(responseBody);
            resolve(responseHandler(responseBody));
          } else {
            let contentType = xhr.getResponseHeader('Content-Type');
            if( contentType &&  contentType.endsWith('json')) {
              let responseBody = JSON.parse(xhr.response);
              let errorMessage = responseBody.error ? responseBody.error : repsonseBody;
              reject(errorMessage)
            }else {
              reject('unexpected response from server: ', xhr);
            }
            //console.log('non 200 status: ', xhr.status);

          }
        }
      }

      xhr.send(JSON.stringify(body));
    });
  }

  static register(user) {
    const body = {
      fullname: user.fullName,
      nickname: "",
      password: user.password,
      email: user.email
    }

    //console.log('calling _call');
    return this._call("POST", "/api/register", body, function(responseBody){
      //console.log('translating body');
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
        token: responseBody.token
      };
    })
  }


}
