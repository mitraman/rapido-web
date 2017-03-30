import React from 'react';
import EditObserver from '../src/js/EditObserver.js';
import ReactTestUtils from 'react-addons-test-utils';

describe('Observer', function() {

  beforeEach(function() {

  })
  it('add an observer', function() {
    let observer = new EditObserver();
    let handler = function() { return; }
    observer.addObserver(handler);
    expect(observer.count()).toBe(1);
  });

  it('add and remove an observer', function() {
    let observer = new EditObserver();
    let handler = function() { console.log('a new function')}
    let initialSize = observer.count();
    observer.addObserver(handler);
    expect(observer.count()).toBe(initialSize+1);
    observer.removeObserver(handler);
    expect(observer.count()).toBe(initialSize);
  })

  it('subscribe and fire an event', function(done) {
    let observer = new EditObserver();
    let handler = function(event) {
      done();
    }
    let initialSize = observer.count();
    observer.addObserver(handler);
    expect(observer.count()).toBe(initialSize+1);
    observer.notify({id: "subscribe-and-notify"});
  })

  it('subscribe and notify multiple observers', function(done) {
    let notificationReceived = {};
    for( var i = 0; i < 20; i++ ) {
      notificationReceived[i]=false;
    }
    let aggregator = function(id) {
      //make sure that all 20 handlers receive notification
      notificationReceived[id] = true;

      let allSignalsReceived = true;
      for( var i = 0; i < 20; i++ ) {
        if( notificationReceived[i] === false) {
          allSignalsReceived = false;
          break;
        }
      }

      if( allSignalsReceived ) {
        done();
      }

    }


    let observer = new EditObserver();
    let initialSize = observer.count();
    for( let i = 0; i < 20; i ++ ) {
      observer.addObserver(function(event) {
        if( event.id === "multiple-observers") {
          aggregator(i);
        }
      })
    }
    observer.notify({id: "multiple-observers"});
  })
})
