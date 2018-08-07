
export class LocalStorageBinding {
  constructor(storageKey, filter, stringifier, reviver) {
    this.storageKey = storageKey;
    this.filter = filter;
    this.stringifier = stringifier;
    this.reviver = reviver;
  }

  save(state) {
    if(window.localStorage) {
      let saveState;
      if(this.filter) {
        saveState = Object.keys(state).filter(this.filter).reduce((acc, key) => {
          acc[key] = state[key];
          return acc;
        }, {});
      }
      else {
        saveState = state;
      }
      window.localStorage.setItem(this.storageKey, JSON.stringify(saveState, this.stringifier));
    }
  }

  load() {
    if(window.localStorage) {
      let storedState = window.localStorage.getItem(this.storageKey);
      return storedState && JSON.parse(storedState, this.reviver);
    }
  }
}

export default LocalStorageBinding;