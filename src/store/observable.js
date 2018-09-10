
export default class Observable {
  constructor(value) {
    this.subs = {};
    this.next = 0;
    this.value = undefined;
  }

  update(value) {
    if (this.value !== value) {
      this.value = value;
    }
    this.notify();
  }


  notify() {
    console.log(this.value, this.subs);
    for (let sub of Object.values(this.subs)) {
      sub(this.value);
    }
  }

  subscribe(callback, instantNotify = false) {
    if (callback) {
      const id = this.next++;

      if (!this.subs) {
        this.subs = [];
      }

      this.subs[id] = callback;

      if (instantNotify) {
        callback(this.value);
      }

      return () => this.unsubscribe(id);
    }
  }

  unsubscribe(id) {
    if (this.subs && this.subs[id]) {
      delete this.subs[id]
    }
  }

  transform(callback) {
    let result = new Observable();
    result.onDestroy = this.subscribe((value) => result.update(callback(value)), true);
    return result;
  }

  switch(by, callbackMap, defaultCallback) {
    let result = new Observable();
    result.onDestroy = this.subscribe(
      (data) => {
        let key = by(data);
        if (callbackMap[key]) {
          result.update(callbackMap[key](data));
        }
        else if (defaultCallback) {
          result.update(defaultCallback(data));
        }
      },
    );
    return result;
  }
}