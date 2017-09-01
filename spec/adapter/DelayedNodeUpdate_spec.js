import DelayedNodeUpdate from '../../src/js/adapter/DelayedNodeUpdate.js';
import Backend from '../../src/js/adapter/Backend.js';
import sinon from 'sinon';

let adapter;

describe('DelayedNodeUpdate', function() {

  beforeAll(function() {
    this.projectId = 10;
    this.sketchId = 22;
    this.nodeId = 11;
    this.updateObject = {
      name: 'newName'
    };
    this.token = "token";
    this.url = __BACKEND + '/api/projects/' + this.projectId + '/sketches/' + this.sketchId + '/nodes/' + this.nodeId;
    //console.log(this.url);
    this.intervalTime = 20000;
  })

  beforeEach(function() {
    jasmine.clock().install();

    this.DelayedNodeUpdate = new DelayedNodeUpdate();
  });

  afterEach(function(){
    jasmine.clock().uninstall();
  })

  it('function mergeObjects should merge the properties of two objects', function() {
    let originalObject = {
      name: 'old_name',
      fullpath: 'old_fullpath',
      enabled: true,
      data: {
        get: {
          enabled: true,
          request: {
            arrayTest: [
              'old_val1',
              {
                name: 'old_objname',
              }
            ],
            body: 'old_body',
            remain: 'old_remain'
          },
          response: {

          }
        },
        put: {
          enabled: false,
          response:{
            status: 200
          }
        }
      }
    }

    let newObject = {
      fullpath: 'new_fullpath',
      newfield: 'new',
      new_enabled: true,
      data: {
        get: {
          enabled: false,
          request: {
            arrayTest: [
              'replace_all'
            ],
            body: 'new_body'
          },
          response: {
            status: 200
          }
        },
        post: {
          request: {
            body: 'new_body'
          }
        }
      },
      newObjectField: {
        field: 'newField'
      }
    }

    let mergedObject = this.DelayedNodeUpdate.mergeObjects(originalObject, newObject);
    expect(mergedObject.name).toBe('old_name');
    expect(mergedObject.fullpath).toBe('new_fullpath');
    expect(mergedObject.enabled).toBe(true);
    expect(mergedObject.new_enabled).toBe(true);
    expect(mergedObject.data).toEqual({
      get: {
        enabled: false,
        request: {
          arrayTest: [
            'replace_all'
          ],
          body: 'new_body',
          remain: 'old_remain'
        },
        response: {
          status: 200
        }
      },
      post: {
        request: {
          body: 'new_body'
        }
      },
      put: {
        enabled: false,
        response:{
          status: 200
        }
      }
    });
    expect(mergedObject.newObjectField).toEqual({
      field: 'newField'
    });
  })

  it('should not fire the backend call until the timer expires', function(done) {

    spyOn(Backend, 'updateNode').and.callThrough();

    // Add the call
    this.DelayedNodeUpdate.write(this.token,
      this.projectId,
      this.sketchId,
      this.nodeId,
      this.updateObject,
      this.intervalTime);
    expect(Backend.updateNode).not.toHaveBeenCalled();
    jasmine.clock().tick(this.intervalTime);
    expect(Backend.updateNode.calls.count()).toBe(1);
    done();
  })

  it('should return immediately on flush when no update is scheduled', function(done) {

    spyOn(Backend, 'updateNode').and.returnValue(
      new Promise( (resolve,reject) => {
          resolve({});
      })
    );

    this.DelayedNodeUpdate.flush()
    .then(() => {
      expect(Backend.updateNode.calls.count()).toBe(0);
    }).catch(e => {
      fail(e);
    }).finally(done);
  })

  it('should fire a delayed call immediaely on flush()', function(done) {
    spyOn(Backend, 'updateNode').and.returnValue(
      new Promise( (resolve,reject) => {
          resolve({});
      })
    );

      // Add the call
      this.DelayedNodeUpdate.write(this.token,
        this.projectId,
        this.sketchId,
        this.nodeId,
        this.updateObject,
        this.intervalTime);
      expect(Backend.updateNode).not.toHaveBeenCalled();

      // flush
      this.DelayedNodeUpdate.flush()
      .then(() => {
        expect(Backend.updateNode.calls.count()).toBe(1);
      }).catch(e => {
        fail(e);
      }).finally(done);
  })

  it('should fire a previously delayed call immediately if another update is added', function(done) {


    spyOn(Backend, 'updateNode').and.callFake(
      (token, projectId, sketchId, nodeId, updateObject) => {
        if(Backend.updateNode.calls.count() === 1) {
          expect(token).toBe(this.token);
          expect(projectId).toBe(this.projectId);
          expect(sketchId).toBe(this.sketchId);
          expect(nodeId).toBe(this.nodeId);
          expect(updateObject).toBe(this.updateObject);
        }else {
          expect(token).toBe(this.token);
          expect(projectId).toBe(2);
          expect(sketchId).toBe(this.sketchId);
          expect(nodeId).toBe(this.nodeId);
          expect(updateObject).toBe(this.updateObject);
        }
        return new Promise( (resolve,reject) => {
          resolve({});
        })
      });

    // Add the call
    this.DelayedNodeUpdate.write(this.token,
      this.projectId,
      this.sketchId,
      this.nodeId,
      this.updateObject,
      this.intervalTime);
    expect(Backend.updateNode).not.toHaveBeenCalled();

    // Make a second call
    this.DelayedNodeUpdate.write(this.token,
      2,
      this.sketchId,
      this.nodeId,
      this.updateObject,
      this.intervalTime);
    expect(Backend.updateNode.calls.count()).toBe(1);
    jasmine.clock().tick(this.intervalTime);
    // Make sure the second call is made after the interval
    expect(Backend.updateNode.calls.count()).toBe(2);
    done();

  })

  it('should merge two updates into a single update if they are for the same node', function(done) {

    spyOn(Backend, 'updateNode').and.callFake(
      (token, projectId, sketchId, nodeId, updateObject) => {
      expect(token).toBe(this.token);
      expect(projectId).toBe(this.projectId);
      expect(sketchId).toBe(this.sketchId);
      expect(nodeId).toBe(this.nodeId);
      expect(updateObject.name).toBe('second');
      expect(updateObject.fullpath).toBe('firstPath');
      return new Promise( (resolve,reject) => {
        resolve({});
      })
    });

    // Add the call
    this.DelayedNodeUpdate.write(this.token,
      this.projectId,
      this.sketchId,
      this.nodeId,
      { name: 'first', fullpath: 'firstPath'},
      this.intervalTime);

    expect(Backend.updateNode).not.toHaveBeenCalled();

    // Send the second call
    this.DelayedNodeUpdate.write(this.token,
      this.projectId,
      this.sketchId,
      this.nodeId,
      { name: 'second'},
      this.intervalTime);
    expect(Backend.updateNode).not.toHaveBeenCalled();
    jasmine.clock().tick(this.intervalTime);

    // // Make sure the second call is made after the interval
    expect(Backend.updateNode.calls.count()).toBe(1);
    done();
  })

  it('update merges should handle the data property', function(done) {
    spyOn(Backend, 'updateNode').and.callFake(
      (token, projectId, sketchId, nodeId, updateObject) => {
        let data = updateObject.data;
        console.log(data);
        expect(data.get).toBeDefined();
        expect(data.put).toBeDefined();
        expect(data.post).toBeDefined();
        expect(data.delete).toBeDefined();
        let dataGet = data.get;
        expect(dataGet.enabled).toBe(false);
        expect(dataGet.request.contentType).toBe('application/json');
        expect(dataGet.request.queryParams).toBe('?source=first');
        expect(dataGet.request.body).toBe('secondbody');
        expect(dataGet.response).not.toBeDefined();
        let dataPut = data.put;
        expect(dataPut.enabled).toBe(true);
        expect(dataPut.request.contentType).toBe('application/json');
        expect(dataPut.request.queryParams).not.toBeDefined();
        expect(dataPut.request.body).toBe('secondbody');
        expect(dataPut.response.status).toBe('first');
        expect(dataPut.response.contentType).toBe('text/html');
        expect(dataPut.response.body).toBe('firstbody');
        let dataDelete = data.delete;
        expect(dataDelete.enabled).toBe(true);
        expect(dataDelete.request.contentType).toBe('application/json');
        expect(dataDelete.request.queryParams).toBe('?source=first');
        expect(dataDelete.request.body).toBe('firstUpdate');
        expect(dataDelete.response).not.toBeDefined();
        let dataPost = data.post;
        expect(dataPost.enabled).not.toBeDefined();
        expect(dataPost.request.contentType).toBe('application/json');
        expect(dataPost.request.queryParams).toBe('?source=second');
        expect(dataPost.request.body).not.toBeDefined();
        expect(dataPost.response.status).toBe('second');
        expect(dataPost.response.contentType).not.toBeDefined();
        expect(dataPost.response.body).not.toBeDefined();


        return new Promise( (resolve,reject) => {
          resolve({});
        })
      });

    let firstUpdateObject = {
      name: "first",
      fullpath: "firstPath",
      data: {
        'get': {
          enabled: true,
          request: {
            contentType: 'application/json',
            queryParams: '?source=first',
            body: 'firstUpdate'
          }
        },
        'put': {
          enabled: true,
          request: {
            contentType: 'application/json',
          },
          response: {
            status: 'first',
            contentType: 'application/json',
            body: 'firstbody'
          }
        },
        'delete': {
          enabled: true,
          request: {
            contentType: 'application/json',
            queryParams: '?source=first',
            body: 'firstUpdate'
          }
        }
      }
    }

    let secondUpdateObject = {
      name: "second",
      data: {
        'get': {
          enabled: false,
          request: {
            body: 'secondbody'
          }
        },
        'put': {
          request: {
            body: 'secondbody',
          },
          response: {
            contentType: 'text/html',
          }
        },
        'post': {
          request: {
            contentType: 'application/json',
            queryParams: '?source=second',
          },
          response: {
            status: 'second'
          }
        }
      }
    }

    // Add the call
    this.DelayedNodeUpdate.write(this.token,
      this.projectId,
      this.sketchId,
      this.nodeId,
      firstUpdateObject,
      this.intervalTime);
    expect(Backend.updateNode).not.toHaveBeenCalled();

    // Send the second call
    this.DelayedNodeUpdate.write(this.token,
      this.projectId,
      this.sketchId,
      this.nodeId,
      secondUpdateObject,
      this.intervalTime);
    expect(Backend.updateNode).not.toHaveBeenCalled();
    jasmine.clock().tick(this.intervalTime);
    // Make sure the second call is made after the interval
    expect(Backend.updateNode.calls.count()).toBe(1);
    done();
  })


});
