const LocalStorageBinding = (storageKey, filter, stringifier, reviver) => {
  return {
    save(state) {
      if (window.localStorage) {
        let saveState;
        if (filter) {
          saveState = Object.keys(state).filter(filter).reduce((acc, key) => {
            acc[key] = state[key];
            return acc;
          }, {});
        }
        else {
          saveState = state;
        }
        window.localStorage.setItem(storageKey, JSON.stringify(saveState, stringifier));
      }
    },

    load() {
      if (window.localStorage) {
        let storedState = window.localStorage.getItem(storageKey);
        return storedState && JSON.parse(storedState, reviver);
      }
    },
  };
};

export default LocalStorageBinding;