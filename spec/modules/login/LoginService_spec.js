import React from 'react';
import LoginService from '../../../src/js/modules/login/LoginService.js';
import Backend from '../../../src/js/adapter/Backend.js';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow, mount } from 'enzyme';
import Promise from 'bluebird';

describe('LoginService ', function() {


  it('should login a user', function(done) {

    const password = 'MyPassword1';
    const email = 'testuser@email.com';
    const fullName = 'first last';
    const nickName = 'nick';
    const userID = 14;
    const token ='llsakdflk1j32lf32'

    spyOn(Backend, "login").and.callFake(function(userInfo) {
       expect(userInfo.email).toBe(email);
       expect(userInfo.password).toBe(password);
       return new Promise( (resolve,reject)=> {
         resolve({
           token: token,
           userId: userID,
           fullName: fullName,
           email: email,
           nickName: nickName
         });
       })
    })

    LoginService.login(email, password)
    .then( () => {
      done();
    }).catch( (error) => {
      fail(error);
    })
  })

  it( 'should store an auth token in permanent storage if "remember me" is ticked', function(done) {
    const password = 'MyPassword1';
    const email = 'testuser@email.com';
    const fullName = 'first last';
    const nickName = 'nick';
    const userID = 14;
    const token ='llsakdflk1j32lf32'

    spyOn(Backend, "login").and.callFake(function(userInfo) {
       expect(userInfo.email).toBe(email);
       expect(userInfo.password).toBe(password);
       return new Promise( (resolve,reject)=> {
         resolve({
           token: token,
           userId: userID,
           fullName: fullName,
           email: email,
           nickName: nickName
         });
       })
    })

    const rememberMe = true;

    var store = {};

    spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
      expect(key).toBe('userInfo');
      let userInfo = JSON.parse(value);
      expect(userInfo.token).toBe(token);
      expect(userInfo.userId).toBe(userID);
      expect(userInfo.email).toBe(email);
      expect(userInfo.nickName).toBe(nickName);
      expect(userInfo.fullName).toBe(fullName);
      return store[key] = value + '';
    });


    LoginService.login(email, password, rememberMe)
    .then( () => {
      done();
    }).catch( (error) => {
      fail(error);
    })
  })

  it( 'should store an auth token in session storage if remember me is not ticked', function(done) {
    const password = 'MyPassword1';
    const email = 'testuser@email.com';
    const fullName = 'first last';
    const nickName = 'nick';
    const userID = 14;
    const token ='llsakdflk1j32lf32'

    spyOn(Backend, "login").and.callFake(function(userInfo) {
       expect(userInfo.email).toBe(email);
       expect(userInfo.password).toBe(password);
       return new Promise( (resolve,reject)=> {
         resolve({
           token: token,
           userId: userID,
           fullName: fullName,
           email: email,
           nickName: nickName
         });
       })
    })

    const rememberMe = true;

    var store = {};

    spyOn(sessionStorage, 'setItem').and.callFake(function (key, value) {
      expect(key).toBe('userInfo');
      let userInfo = JSON.parse(value);
      expect(userInfo.token).toBe(token);
      expect(userInfo.userId).toBe(userID);
      expect(userInfo.email).toBe(email);
      expect(userInfo.nickName).toBe(nickName);
      expect(userInfo.fullName).toBe(fullName);
      return store[key] = value + '';
    });


    LoginService.login(email, password, rememberMe)
    .then( () => {
      done();
    }).catch( (error) => {
      fail(error);
    })
  })

  it('should alert the user if the API call fails', function(done) {

    const password = 'MyPassword1';
    const email = 'testuser@email.com';

    const serverError = 'some unexplained problem';

    spyOn(Backend, "login").and.callFake(function(userInfo) {
       expect(userInfo.email).toBe(email);
       expect(userInfo.password).toBe(password);
       return new Promise( (resolve,reject)=> {
         reject(serverError);
       })
     })

     LoginService.login(email, password)
     .then( () => {
       fail('login call should have failed.')
     }).catch( (error) => {
       expect(error).toBe(serverError);
       done();
     })


  });


});
