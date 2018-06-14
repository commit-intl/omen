
export class DataStore {

  constructor(state) {
    this.state = state;
    this.subs = {};
  }

  get(path) {
    if(path) {
      if(typeof path === 'string'){
        path = path.split('.')
      }
      let dataStore = this.state;
      for (let i in path) {
        if(!dataStore) {
          return dataStore;
        }
        dataStore = dataStore[path[i]];
      }
      return dataStore;
    }
    return this.state;
  }

  set(path, value) {
    if(typeof path === 'string'){
      path = path.split('.')
    }

    if(path) {
      let parent = this.get(path.slice(0,-1));
      if(parent) {
        if(value !== undefined) {
          parent[path[path.length-1]] = typeof value === 'function' ? value(parent[path[path.length-1]]) : value;
        }
        else {
          delete parent[path[path.length-1]];
        }
        this.notify(path);
      }
    }
    else if (path === ''){
      this.state = typeof value === 'function' ? value(this.state) : value;
      this.notify(path);
    }
  }

  addListener(path, callback, options) {
    path = path || '';
    if(!this.subs[path]) {
      this.subs[path] = [];
    }
    this.subs[path].push({callback, options});
    if(!options || !options.noInitial) {
      callback(this.get(path));
    }
  }

  removeListener(path, callback) {
    if(this.subs[path]) {
      this.subs[path] = this.subs[path].filter((listener) => listener && listener.callback !== callback);
    }
  }

  notify(path) {
    if(typeof path === 'string'){
      path = path.split('.')
    }

    let data = this.state;

    for (let s in this.subs['']) {
      this.subs[''][s].callback(data);
    }

    for(let i = 0; i < path.length; i++) {
      let key = path.slice(0, i+1).join('.');
      if(this.subs[key]) {
        for (let s = 0; s < this.subs[key].length; s++) {
          const listener = this.subs[key][s];
          const options = listener.options;
          if(
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

export default DataStore;