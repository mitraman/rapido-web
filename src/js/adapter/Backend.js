let implName = '';

export default class {
  constructor(name) {
    this.implName = name;
  }

  login(username, password) {
    return new Promise(
      function(resolve, reject) {
        reject(new Error("Not Implemented"));
      }
    );
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
