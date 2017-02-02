import Adapter from '../../src/js/adapter/Adapter.js'
import MockBackend from '../../src/js/adapter/MockBackend.js'

describe("Backend Adapter", function() {

  it("should store a mock backend implementation", function() {
    Adapter.setBackend(new MockBackend());
  })

  it("should return the stored backend implementation", function() {
    expect(Adapter.call()).not.toBe(null);
    console.log(Adapter.call());
    expect(Adapter.call().getName()).toBe("MockBackend");
  })

  it("should allow a call to login", function(done) {
    Adapter.call().login("username", "password")
      .catch(function(error) {
        expect(error.message).not.toBeNull();
        done();
      });
  })

});
