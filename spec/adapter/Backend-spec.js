import Backend from '../../src/js/adapter/Backend.js';
import sinon from 'sinon';

let adapter;

describe('Backend client', function() {

  beforeEach(function() {
    this.server = sinon.fakeServer.create();
    this.server.respondImmediately = true;
    jasmine.clock().install();
  });

  afterEach(function(){
    jasmine.clock().uninstall();
  })

  it('should throw an error if the response body is not JSON parseable', function(done) {

    // Setup the mock response
    this.server.respondWith("GET", "/api/endpoint", function(xhr) {
      xhr.respond(200, {"Content-Type": "application/json"},'{badjson: 14');
    });

    // Make the call
    Backend._call("GET", "/api/endpoint", { sample: 'value'}, ()=>{return null;})
    .then(()=>{
      fail("The request should have thrown an error.")
    }).catch((error)=>{
      expect(error).not.toBeUndefined();
    }).finally(done)
  })

  xit('should throw an error if the server does not respond', function(done) {

    //TODO: figure out how to make the mock server delay long enough for the timeout test to be conducted

    // Setup the mock response
    this.server.respondWith("GET", "/api/endpoint", function(xhr) {
      // Do not respond
      console.log('in response handler');
      jasmine.clock().tick(10000);
      console.log('responding');
        xhr.respond(200, {"Content-Type": "application/json"},'{"json": "14"}');
    });


    // Make the call
    Backend._call("GET", "/api/endpoint", { sample: 'value'}, ()=>{return null;})
    .then(()=>{
      fail("The request should have thrown an error.")
    }).catch((error)=>{
      console.log(error);
      expect(error).not.toBeUndefined();
    }).finally(done)
  }, 10000);

  xit('should redirect if the server responds with a 3xx', function(done) {

    let redirectEndpointCalled = false;
    // Setup the mock response
    this.server.respondWith("GET", "/api/endpoint", function(xhr) {
      xhr.respond(301, {"Location": "/api/newlocation"},'{}');
    });

    this.server.respondWith("GET", "/api/newlocation", function(xhr) {
      console.log('called new endpoint');
      redirectEndpointCalled = true;
      xhr.respond(200, {"Content-Type": "application/json"},'{"json": "14"}');
    })

    // Make the call
    Backend._call("GET", "/api/endpoint", { sample: 'value'}, ()=>{return null;})
    .then(()=>{
      expect(redirectEndpointCalled).toBe(true);
      fail("The request should have thrown an error.")
    }).catch((error)=>{
      console.log(error);
      expect(error).toBeUndefined();
    }).finally(done)

  })

  it('should throw an error if the server provides a non 200 status', function(done) {

    // Setup the mock response
    this.server.respondWith("GET", "/api/endpoint", function(xhr) {
      xhr.respond(400, {"Content-Type": "application/json"},'{}');
    });

    // Make the call
    Backend._call("GET", "/api/endpoint", { sample: 'value'}, ()=>{return null;})
    .then(()=>{
      fail("The request should have thrown an error.")
    }).catch((error)=>{
      expect(error).not.toBeUndefined();
    }).finally(done)

  })

  //TODO: in the future we should have a more graceful way for the server to indicate validation errors
  // and have the client act accordingly
  it('should return an error if 4xx error is returned', function(done) {
    const userDetails = {
      "fullName": "username",
      "nickName": "",
      "email": "email@email.com",
      "password": "password"
    }

    // This endpoint will not be reached by the client.  The fake server will return a 404 instead.
     this.server.respondWith("POST", "/unreachable", function(xhr) {

       xhr.respond(401, {"Content-Type": "application/json"},
         JSON.stringify({
            vlaue: 'unreachable'
         }));
    });

    Backend.register(userDetails)
    .then((newUser)=> {
      fail('an error was expected, but received a succesful response instead.')
    }).catch((error)=> {
      expect(error).not.toBeUndefined();
      expect(error.startsWith('unexpected response from server')).toBe(true);
    }).finally(done)
  })

  it('should register a new user', function(done) {
    const userDetails = {
      "fullName": "username",
      "nickName": "",
      "email": "email@email.com",
      "password": "password"
    }

     this.server.respondWith("POST", "/api/register", function(xhr) {
       expect(xhr.requestBody.fullname).not.toBeNull();
       expect(xhr.requestBody.email).not.toBeNull();
       expect(xhr.requestBody.nickname).not.toBeNull();
       expect(xhr.requestBody.password).not.toBeNull();

       xhr.respond(200, {"Content-Type": "application/json"},
         JSON.stringify({
            id: (Math.random() * (32767 - 1)) + 1,
            fullName: xhr.requestBody.fullname,
            nickName: xhr.requestBody.nickname,
            email: xhr.requestBody.email
         }));
    });

    Backend.register(userDetails)
    .then((newUser)=> {
      expect(newUser.id).not.toBeUndefined();
    }).catch((error)=> {
      fail(error);
    }).finally(done)
  })

  it('should login a registered user', function(done) {
    const userDetails = {
      "email": "email@email.com",
      "password": "password"
    }

     this.server.respondWith("POST", "/api/login", function(xhr) {
       expect(xhr.requestBody.email).not.toBeNull();
       expect(xhr.requestBody.password).not.toBeNull();

       xhr.respond(200, {"Content-Type": "application/json"},
         JSON.stringify({
            token: (Math.random() * (32767 - 1)) + 1
         }));
    });

    Backend.login(userDetails)
    .then((result)=> {
      expect(result.token).not.toBeUndefined();
    }).catch((error)=> {
      fail(error);
    }).finally(done)
  })



});
