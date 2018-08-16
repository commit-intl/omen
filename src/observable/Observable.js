export default class Observable {
  constructor() {
    this.subs = {};
    this.next = 0;
    this.value = undefined;
  }

  update(value) {
    if (this.value !== value) {
      this.value = value;
    }
    this.notifySubs()
  }

  notifySubs() {
    for (let sub of this.subs) {
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
    }
  }

  unsubscribe(id) {
    if (this.subs[id]) {
      delete this.subs[id]
    }
  }

  transform(callback) {
    let result = new Observable();
    let sub = this.subscribe((value) => result.update(callback({data: value})));
    return result;
  }

  map(callback) {
    let result = new Observable();
    let sub = this.subscribe(
      (value) => {
        if (typeof value === 'object') {
          result.update(
            Array.isArray(value)
              ? value.map((data, index) => callback({ data, key: index }))
              : Object.keys(value).map(key => callback({ data: value[key], key: key }))
          );
        }
      }
    );

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
}
