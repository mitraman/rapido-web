import Adapter from '../../src/js/adapter/Backend.js';

let adapter;

describe('Backend abstract class', function() {

  beforeEach(function() {
    adapter = new Adapter('test');
  })

  it('login', function(done) {
    adapter.login('username', 'password')
      .then(function() {
          expect(true).toBe(false);
          done();
      }).catch( function(error) {
        expect(error.message).toBe("Not Implemented")
          done();
      });
  })

  it('register', function(done) {
    const userDetails = {
      "username": "username",
      "password": "password",
      "email": "email@email.com"
    }
    adapter.register(userDetails).then(function() {
      expect(true).toBe(false);
      done();
    }).catch(function(error) {
      expect(error.message).toBe("Not Implemented");
      done();
    });
  })

  it('list projects', function(done) {
    let token = "";
    adapter.getProjects(token).then(function() {
      expect(true).toBe(false);
      done();
    }).catch(function(error) {
      expect(error.message).toBe("Not Implemented");
      done();
    });
  })

});
