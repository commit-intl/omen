
export default class Observable {
  constructor(value) {
    this.subs = {};
    this.next = 0;
    this.value = undefined;
  }

  set(value) {
    if (this.value !== value) {
      this.value = value;
    }
    this.notify();
  }


  notify() {
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
    result.onDestroy = this.subscribe((value) => result.set(callback(value)), true);
    return result;
  }

  switch(by, callbackMap, defaultCallback) {
    let result = new Observable();
    result.onDestroy = this.subscribe(
      (data) => {
        let key = by(data);
        if (callbackMap[key]) {
          result.set(callbackMap[key](this));
        }
        else if (defaultCallback) {
          result.set(defaultCallback(this));
        }
      },
      true
    );
    return result;
  }
}