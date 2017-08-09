import Backend from './Backend.js';
var Promise = require("bluebird");

/**
* Queues up backend writes and notifies the client when they have been written
*/
export default class DelayedNodeUpdate {
  constructor() {
    this.timeoutID = null;
    this.pendingUpdate = {
      id: null,
      updateObject: {}
    };
  }

  scheduleUpdate(token, projectId, sketchId, nodeId, updateObject, intervalTime) {
    // Scheudle the new update
    this.scheduledUpdate = {
      token: token,
      projectId: projectId,
      sketchId: sketchId,
      nodeId: nodeId,
      updateObject: updateObject
    };

    return new Promise( (resolve,reject) => {

      this.timeoutID = window.setTimeout( () => {
        Backend.updateNode(token, projectId, sketchId, nodeId, updateObject)
        .then( result => {
          resolve(result);
        }).catch( e => {
          reject(e);
        })
      }, intervalTime);

      //Backend.updateNode(token, projectId, sketchId, nodeId, updateObject);
    });
  }

  write(token, projectId, sketchId, nodeId, updateObject, intervalTime) {
    //console.log('write:', updateObject);

    return new Promise( (resolve,reject) => {

      // check if a timeout is already scheduled
      if(this.timeoutID) {
        // Cancel the last timeout
        window.clearTimeout(this.timeoutID);

        // If the new update is for the same node as the scheduled one, merge the updates
        if( this.scheduledUpdate.projectId === projectId &&
          this.scheduledUpdate.sketchId === sketchId &&
          this.scheduledUpdate.nodeId === nodeId) {

          let mergedUpdate = {};

          if( !updateObject.name) {
            if( this.scheduledUpdate.updateObject.name) {
              mergedUpdate.name = this.scheduledUpdate.updateObject.name;
            }
          }else {
            mergedUpdate.name = updateObject.name;
          }

          if( !updateObject.fullpath ) {
            if( this.scheduledUpdate.updateObject.fullpath ) {
              mergedUpdate.fullpath = this.scheduledUpdate.updateObject.fullpath;
            }
          }else {
            mergedUpdate.fullpath = updateObject.fullpath;
          }

          if( !updateObject.data &&  this.scheduledUpdate.updateObject.data ) {
              mergedUpdate.data = this.scheduledUpdate.updateObject.data;
          }else if( updateObject.data && !this.scheduledUpdate.updateObject.data ) {
              mergedUpdate.data = updateObject.data;
          }else if(updateObject.data) {
            // Merge each object key
            let mergedData = this.scheduledUpdate.updateObject.data;

            Object.keys(updateObject.data).forEach( key => {
              if( mergedData[key] ) {
                if( updateObject.data[key].hasOwnProperty('enabled') ) {
                  mergedData[key].enabled = updateObject.data[key].enabled;
                }

                if( updateObject.data[key].request) {

                  if( !mergedData[key].request) {
                    mergedData[key].request = {};
                  }

                  if( updateObject.data[key].request.contentType ) {
                    mergedData[key].request.contentType =  updateObject.data[key].request.contentType
                  }
                  if( updateObject.data[key].request.queryParams ) {
                    mergedData[key].request.queryParams =  updateObject.data[key].request.queryParams
                  }
                  if( updateObject.data[key].request.body ) {
                    mergedData[key].request.body =  updateObject.data[key].request.body
                  }
                }

                if( updateObject.data[key].response) {

                  if( !mergedData[key].response) {
                    mergedData[key].response = {};
                  }

                  if( updateObject.data[key].response.status ) {
                    mergedData[key].response.status =  updateObject.data[key].response.status
                  }
                  if( updateObject.data[key].response.contentType ) {
                    mergedData[key].response.contentType =  updateObject.data[key].response.contentType
                  }
                  if( updateObject.data[key].response.body ) {
                    mergedData[key].response.body =  updateObject.data[key].response.body
                  }

                }
              }else {
                mergedData[key] = updateObject.data[key];
              }
            })

            mergedUpdate.data = mergedData;

          }

          return this.scheduleUpdate(token, projectId, sketchId, nodeId, mergedUpdate, intervalTime)

        }else {
          // This is an update for a new node, so fire off the old one immediately
          Backend.updateNode(this.scheduledUpdate.token,
            this.scheduledUpdate.projectId,
            this.scheduledUpdate.sketchId,
            this.scheduledUpdate.nodeId,
            this.scheduledUpdate.updateObject);

          return this.scheduleUpdate(token, projectId, sketchId, nodeId, updateObject, intervalTime)
        }

      }else {
        // Case where there is no update scheduled
        return this.scheduleUpdate(token, projectId, sketchId, nodeId, updateObject, intervalTime);
      }
    });
  }

}
