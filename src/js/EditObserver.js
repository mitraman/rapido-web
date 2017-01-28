// Observer pattern class to allow the edit view to notify other views about events

let instance = null;
let handlers = [];

export default class  {

  constructor() {
    if( !instance ) {
      instance = this;
    }
    return instance;
  }

  addObserver(fn) {
    handlers.push(fn);
  }

  removeObserver(fn) {
    handlers = handlers.filter(
            function(item) {
                if (item !== fn) {
                    return item;
                }
            }
        );
  }

  count() {
    return handlers.length;
  }

  getObservers() {
    return handlers;
  }

  notify(event) {
    handlers.forEach(function(handler) {
      handler(event);
    })

  }
}
