import MockBackend from '../../src/js/adapter/MockBackend.js';
var Promise = require("bluebird");

let adapter;

describe('Mockbackend Implementation', function() {

  beforeEach(function() {
    adapter = new MockBackend();
  })

  it('should login a user', function(done) {

    adapter.setLoginProvider(function(username, password) {
      return new Promise(
        function(resolve,reject) {
          resolve({token: "1234"});
        }
      )
    });

    adapter.login('mock-test', 'password')
      .then(function(result) {
        expect(result.token).toBe("1234");
        done();
      }).catch( function(error) {
        expect(error).toBeNull();
        done();
      });
  })

  it('should fail if login handler is not set', function(done) {
    let badAdapter = new MockBackend();
    badAdapter.login('mock-test', 'password')
      .then(function(result) {
        expect(result).toBeNull();
        done();
      }).catch(function(error) {
        expect(error.message).toBe("Handler not set");
        done();
      })
  })

  it('should register new user', function(done) {

    adapter.setRegisterProvider(function(userDetails) {
      return new Promise(
        function(resolve, reject) {
          resolve({username: "username"})
        }
      )
    })
    adapter.register({
      "username": "username",
      "password": "password",
      "email": "email@email.com"
    }).then(function(result) {
      expect(result).not.toBeNull();
      done();
    }).catch(function(error) {
      expect(error).toBeNull();
      done();
    });
  })

  it('should fail if registration handler is not set', function(done) {
    let badAdapter = new MockBackend();
    badAdapter.register({
      "username": "username",
      "password": "password",
      "email": "email@email.com"
    })
      .then(function(result) {
        expect(result).toBeNull();
        done();
      }).catch(function(error) {
        expect(error.message).toBe("Handler not set");
        done();
      })
  })



});
