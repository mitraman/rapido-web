var Promise = require("bluebird");

let implName = '';

export default class {
  constructor(name) {
    implName = name;
  }

  login(username, password) {
    return new Promise(
      function(resolve, reject) {
        reject(new Error("Not Implemented"));
      }
    );
  }

  getName() {
    return implName;
  }

  register(details) {
    return new Promise(
      function(resolve, reject) {
        reject(new Error("Not Implemented"));
      }
    );
  }

  getProjects(token) {
    return new Promise(
      function(resolve, reject) {
        reject(new Error("Not Implemented"));
      }
    )
  }

}
