export default class Observable {
  constructor(onDestroy) {
    this.subs = {};
    this.next = 0;
    this.value = undefined;
    this.onDestroy = onDestroy;
  }

  update(value) {
    if (this.value !== value) {
      this.value = value;
    }
    this.notifySubs()
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
    let result = new Observable();
    let sub = this.subscribe((value) => result.update(callback({ data: value })));
    return result;
  }

  map(callback) {
    let result = new Observable();
    let children = {};
    let handler = (value) => {
      if (typeof value === 'object') {
        let keys = Object.keys(value);
        let childKeys = Object.keys(children);
        let callbackResults = [];
        for (let key of keys) {
          if (!children[key]) {
            let keyObs = new Observable();
            let valueObs = new Observable();
            children[key] = {
              key: keyObs,
              value: valueObs,
              result: callback({key: keyObs, value: valueObs}),
            };
          }
          children[key].key.update(key);
          children[key].value.update(value);
          callbackResults.push(children[key].result);
          childKeys.slice(childKeys.indexOf(key), 1);
        }
        for (let key of childKeys) {
          children[key].key.destroy();
          children[key].value.destroy();
          delete children[key];
        }
        return result.update(callbackResults);
      }
    };

    let sub = this.subscribe(handler, true);
    return result;
  }

  switch(by, callbackMap, defaultCallback) {
    let result = new Observable();
    let sub = this.subscribe(
      (data) => {
        let key = by(data);
        if (callbackMap[key]) {
          result.update(callbackMap[key]({ data }));
        }
        else if (defaultCallback) {
          result.update(defaultCallback({ data }));
        }
      }
    );

    return result;
  }

  destroy() {
    this.subs = undefined;
    if (this.onDestroy) {
      this.onDestroy();
    }
  }
}
