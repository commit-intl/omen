export class Store {

  constructor(state, binding) {
    this.state = state;
    this.binding = binding;
    this.subs = {};

    this.load();
  }

  load() {
    if(this.binding) {
      let result = this.binding.load();
      if(result) {
        this.state = {
          ...this.state,
          ...result,
        };
      }
    }
  }

  save() {
    if(this.binding) {
      this.binding.save(this.state);
    }
  }

  get(path) {
    if (path) {
      if (typeof path === 'string') {
        path = path.split('.')
      }
      let dataStore = this.state;
      for (let i in path) {
        if (!dataStore) {
          return dataStore;
        }
        dataStore = dataStore[path[i]];
      }
      return dataStore;
    }
    return this.state;
  }

  set(path, value) {
    if (typeof path === 'string') {
      path = path.split('.')
    }

    if (path) {
      let parent = this.get(path.slice(0, -1));
      if (parent) {
        if (value !== undefined) {
          parent[path[path.length - 1]] = typeof value === 'function' ? value(parent[path[path.length - 1]]) : value;
        }
        else {
          if (Array.isArray(parent)) {
            parent.splice(path[path.length-1], 1)
          }
          else {
            delete parent[path[path.length - 1]];
          }
        }
        this.notify(path);
      }
    }
    else if (path === '') {
      this.state = typeof value === 'function' ? value(this.state) : value;
      this.notify(path);
    }

    this.save();
  }

  addListener(path, callback, options) {
    path = path || '';
    if (!this.subs[path]) {
      this.subs[path] = [];
    }
    this.subs[path].push({ callback, options });
    if (!options || !options.noInitial) {
      callback(this.get(path));
    }
  }

  removeListener(path, callback) {
    if (this.subs[path]) {
      this.subs[path] = this.subs[path].filter((listener) => listener && listener.callback !== callback);
    }
  }

  notify(path) {
    if (typeof path === 'string') {
      path = path.split('.')
    }

    let data = this.state;

    for (let s in this.subs['']) {
      const options = this.subs[''][s].options;
      if (
        !options
        || (options.depth != null && options.depth >= path.length)
      ) {
        this.subs[''][s].callback(data);
      }
    }

    for (let i = 0; i < path.length; i++) {
      let key = path.slice(0, i + 1).join('.');
      if (this.subs[key]) {
        for (let s = 0; s < this.subs[key].length; s++) {
          const listener = this.subs[key][s];
          const options = listener.options;
          if (
            !options
            || (options.depth != null && options.depth >= (path.length - i - 1))
          ) {
            listener.callback(data[path[i]]);
          }
        }
      }
      data = typeof data === 'object' ? data[path[i]] : undefined;
    }
  }
}

export default Store;