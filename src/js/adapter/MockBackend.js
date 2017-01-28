import Backend from './Backend';

let loginProvider;
let registerProvider;

const NoHandler = new Promise(function(resolve, reject) {
  reject(new Error("Handler not set"));
})

export default class extends Backend {

    constructor() {
        super("MockBackend");
    }

    setLoginProvider(fn) {
      this.loginProvider = fn;
    }

    setRegisterProvider(fn) {
      this.registerProvider = fn;
    }

    login(username, password) {
      let promiseVal = this.loginProvider ?  this.loginProvider(username, password) : NoHandler;
      return promiseVal;
    }

    register(userDetails) {
      let promiseVal = this.registerProvider ?  this.registerProvider(userDetails) : NoHandler;
      return promiseVal;
    }


}
