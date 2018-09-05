import {getChild, mergePath} from './path.helper';

export default class Pointer {
  constructor(store, path, options) {
    this.store = store;
    this.path = path;
    this.options = options;
    this.subs = {};
    this.next = 0;
    this.value = undefined;
  }

  set(value) {
    this.store.set(this.path, value);
  }

  get() {
    return this.value;
  }

  update(value) {
    if (this.value !== value) {
      this.value = value;
    }
    this.notifySubs();
  }

  notifySubs() {
    for (let sub of Object.values(this.subs)) {
      sub(this.value);
    }
  }


  subscribe(callback, instantNotify = false) {
    if (callback) {
      const id = this.next++;
      this.subs[id] = callback;
      if (instantNotify) {
        callback(this.value);
      }

      return id;
    }
  }

  unsubscribe(id) {
    if (this.subs[id]) {
      delete this.subs[id]
    }
  }

  transform(callback) {
    let result = new Pointer(this.store, this.path, this.options);
    let sub = this.subscribe((value) => result.update(callback({_value: value})), true);
    return result;
  }

  child(childPath) {
    return this.store.getPointer(mergePath(this.path, childPath), this.options);
  }

  map(callback, idCallback = (value, index) => index) {
    let pointer = this.store.getPointer(this.path, {depth: 1});
    let children = {};
    let handler = ({_value}) => {
      if (typeof _value === 'object') {
        let keys = Object.keys(_value);
        let childrenIds = Object.keys(children);
        let callbackResults = [];
        for (let key of keys) {
          let id = idCallback(_value[key], key);
          if (!children[id]) {
            let keyObs = new Pointer(this.store, this.path + '.' + key, this.options);
            let valueObs = new Pointer(this.store, this.path + '.' + key, this.options);
            children[id] = {
              key: keyObs,
              value: valueObs,
              result: callback({_value: valueObs, _key: keyObs}),
            };
            if(children[id].result && children[id].result.props) {
              children[id].result.props['data-id'] = id;
            }
          }
          children[id].key.update(key);
          children[id].value.update(_value[key]);
          callbackResults.push(children[id].result);
          const index = childrenIds.indexOf(id);
          if (index >= 0) {
            childrenIds.splice(index, 1);
          }
        }
        for (let id of childrenIds) {
          delete children[id];
        }

        console.log('Pointer.map', callbackResults, children, idCallback);

        return callbackResults;
      }
    };

    return pointer.transform(handler);
  }

  switch(by, callbackMap, defaultCallback) {
    let result = new Pointer(this.store, this.path, this.options);
    let sub = this.subscribe(
      (data) => {
        let key = by(data);
        if (callbackMap[key]) {
          result.update(callbackMap[key]({_value: data}));
        }
        else if (defaultCallback) {
          result.update(defaultCallback({_value: data}));
        }
      },
    );

    return result;
  }
}