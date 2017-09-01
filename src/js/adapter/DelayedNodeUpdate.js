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

  // Immediately write any scheduled updates
  flush() {
    return new Promise( (resolve,reject) => {
      if(this.timeoutID) {
        // Cancel the last timeout
        window.clearTimeout(this.timeoutID);
        Backend.updateNode(this.scheduledUpdate.token,
          this.scheduledUpdate.projectId,
          this.scheduledUpdate.sketchId,
          this.scheduledUpdate.nodeId,
          this.scheduledUpdate.updateObject)
        .then(result => {
          resolve();
        });
      }else {
        resolve();
      }
    })
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

  // Merges objects, favouring the new object's properties
  // NOTE: arrays are replaced and merge assumes all fields with the same name have the same type
  mergeObjects(originalObject, newObject) {
    let mergedObject = {};

    // Recursively copy new keys over
    Object.keys(newObject).forEach(key => {
      if( !originalObject.hasOwnProperty(key) ) {
        mergedObject[key] = newObject[key];
      }else if( typeof originalObject[key] === 'object' ){
        if( Array.isArray(originalObject[key])) {
          mergedObject[key] = newObject[key];
        }else {
          let childObject = this.mergeObjects(originalObject[key], newObject[key]);
          mergedObject[key] = childObject;
        }
      }else {
        mergedObject[key] = newObject[key];
      }
    });

    // Shallow copy any keys that only exist in the original object
    Object.keys(originalObject).forEach(key => {
      if(!mergedObject.hasOwnProperty(key)) {
        mergedObject[key] = originalObject[key];
      }
    })

    return mergedObject

  }

  write(token, projectId, sketchId, nodeId, updateObject, intervalTime) {
    //console.log('write:', updateObject);

    // check if a timeout is already scheduled
    if(this.timeoutID) {
      // Cancel the last timeout
      window.clearTimeout(this.timeoutID);

      // If the new update is for the same node as the scheduled one, merge the updates
      if( this.scheduledUpdate.projectId === projectId &&
        this.scheduledUpdate.sketchId === sketchId &&
        this.scheduledUpdate.nodeId === nodeId) {

        let mergedUpdate = this.mergeObjects(this.scheduledUpdate.updateObject, updateObject);
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
  }


}
