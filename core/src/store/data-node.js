const DataNode = (initName, parentNode) => {
  const subs = {};
  let next = 0;
  const name = initName;
  let value = undefined;
  const parent = parentNode;
  const children = {};

  const self = {
    __isDataNode: 1,
    name,
    children,
    subs,
    get() {
      return value;
    },

    set(v, path = undefined, propagateUp = true) {
      if (!path) {
        if (v !== value) {
          if (parent && propagateUp) {
            parent.set(v, name);
          }
          else {
            value = v;
            this.notify(propagateUp);
          }
        }
        return false;
      }

      const setByString = (v, path) => {
        if (typeof v === 'function') {
          v = v(value && value[path]);
        }

        if (v === undefined) {
          if (typeof value === 'object') {
            if (Array.isArray(value)) {
              value.splice(path, 1);
            }
            else {
              delete value[path];
            }
          }
          else {
            value = undefined;
          }
        }
        else {
          if (typeof value === 'object') {
            value[path] = v;
          }
          else {
            value = { [path]: v };
          }
        }

        if (children && children[path]) {
          children[path].set(v, undefined, false);
        }
      };

      if (Array.isArray(path)) {
        setByString(path[0]);
        if (path.length > 1) {
          if (!children[path[0]]) {
            children[path[0]] = DataNode(path[0], self);
          }
          children[path[0]].set(v, path.slice(1));
        }
      }
      else {
        setByString(v, path);
      }

      self.notify();
    },

    notify(propagateUp = true, propagateDown = true) {
      if(parent && propagateUp) {
        parent.notify(true, false);
      }

      for (let id in subs) {
        subs[id](value);
      }

      if (children && propagateDown) {
        for (let key in children) {
          if (children[key]) {
            children[key].set(value && value[key], undefined, false);
          }
        }
      }
    },

    subscribe(callback, instantNotify = false) {
      if (callback) {
        const id = next++;
        subs[id] = callback;

        if (instantNotify) {
          callback(value);
        }

        return () => self.unsubscribe(id);
      }
    },

    unsubscribe(id) {
      if (subs && subs[id]) {
        delete subs[id]
      }
    },

    child(path) {
      if (!path) return self;

      const childByString = (path) => {
        if (children[path]) {
          return children[path];
        }
        else {
          children[path] = DataNode(path, self);
          children[path].set(value && value[path], undefined, false);
          return children[path];
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
    },

    transform(callback) {
      let result = DataNode();
      result.onDestroy = self.subscribe((value) => result.set(callback(value)), true);
      return result;
    },

    switch(by, callbackMap, defaultCallback) {
      let result = DataNode();
      let prevKey = undefined;
      result.onDestroy = self.subscribe(
        (data) => {
          let key = by(data);
          if(prevKey !== key) {
            if (callbackMap[key]) {
              result.set(callbackMap[key](self));
            }
            else if (defaultCallback) {
              result.set(defaultCallback(self));
            }
            prevKey = key;
          }
        },
        true
      );
      return result;
    },

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
              let valueObs = self.child(key);
              children[id] = {
                value: valueObs,
                result: callback(valueObs, key),
              };
              if (children[id].result && children[id].result.props) {
                children[id].result.props['data-id'] = id;
              }
            }
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

      return self.transform(handler);
    }
  };

  return self;
};

export default DataNode;