import Observable from './observable';

export default class StoreNode extends Observable {

  constructor(name, parent) {
    super();
    this.name = name;
    this.parent = parent;
    this.children = undefined;
  }

  get() {
    return this.value
  }

  set(value, path = undefined, ignoreParent = false) {
    if (!path) {
      if (value !== this.value) {
        if (this.parent && !ignoreParent) {
          this.parent.set(value, this.name);
        }
        else {
          this.value = value;
          this.notify(!ignoreParent);
        }
      }
      return;
    }

    const setByString = (value, path) => {
      if (typeof value === 'function') {
        value = value(this.value && this.value[path]);
      }

      if(value === undefined) {
         if(typeof this.value === 'object') {
           if(Array.isArray(this.value)) {
             this.value.splice(path, 1);
           }
           else {
             delete this.value[path];
           }
         }
         else {
           this.value = undefined;
         }
      }
      else {
        if (typeof this.value === 'object') {
          this.value[path] = value;
        }
        else {
          this.value = {[path]: value};
        }
      }

      if (this.children && this.children[path]) {
        this.children[path].set(value, undefined, true);
      }
    };

    if (Array.isArray(path)) {
      setByString(path[0]);
      if (path.length > 1) {
        if (!this.children) {
          this.children = {};
        }
        if (!this.children[path[0]]) {
          this.children[path[0]] = new StoreNode(path[0], this);
        }
        this.children[path[0]].set(value, path.slice(1));
      }
    }
    else {
      setByString(value, path);
    }

    this.notify();
  }

  notify(propagateUp = true, propagateDown = true) {
    if(this.parent && propagateUp) {
      this.parent.notify(true, false);
    }

    super.notify();

    if (this.children && propagateDown) {
      let keys = Object.keys(this.children);
      for (let key of keys) {
        if (this.children[key]) {
          this.children[key].set(this.value && this.value[key], undefined, true);
        }
      }
    }
  }

  child(path) {
    if (!path) return this;

    if (!this.children) {
      this.children = {};
    }

    const childByString = (path) => {
      if (this.children[path]) {
        return this.children[path];
      }
      else {
        this.children[path] = new StoreNode(path, this);
        this.children[path].set(this.value && this.value[path], undefined, true);
        return this.children[path];
      }
    };

    if (Array.isArray(path)) {
      let node = childByString(path[0]);
      if (path.length > 1) {
        node = node.child(path.slice(1));
      }
      return node;
    }

    return childByString(path);
  }

  map(callback, idCallback = (value, index) => index) {
    let children = {};
    let handler = (value) => {
      if (typeof value === 'object') {
        let keys = Object.keys(value);
        let childrenIds = Object.keys(children);
        let callbackResults = [];
        for (let key of keys) {
          let id = idCallback(value[key], key);
          if (!children[id]) {
            let valueObs = this.child(key);
            children[id] = {
              value: valueObs,
              result: callback(valueObs, key),
            };
            if (children[id].result && children[id].result.props) {
              children[id].result.props['data-id'] = id;
            }
          }
          children[id].value.set(value[key]);
          callbackResults.push(children[id].result);
          const index = childrenIds.indexOf(id);
          if (index >= 0) {
            childrenIds.splice(index, 1);
          }
        }
        for (let id of childrenIds) {
          delete children[id];
        }

        return callbackResults;
      }
    };

    return this.transform(handler);
  }
}