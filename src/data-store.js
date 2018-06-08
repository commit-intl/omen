
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
        parent[path[path.length-1]] = typeof value === 'function' ? value(parent[path[path.length-1]]) : value;
        this.notify(path);
      }
    }
    else if (path === ''){
      this.state = typeof value === 'function' ? value(this.state) : value;
      this.notify(path);
    }
  }

  addListener(path, callback) {
    path = path || '';
    if(!this.subs[path]) {
      this.subs[path] = [];
    }
    this.subs[path].push(callback);
    callback(this.get(path));
  }

  removeListener(path, callback) {
    if(this.subs[path]) {
      this.subs[path] = this.subs[path].filter((cb) => cb !== callback);
    }
  }

  notify(path) {
    if(typeof path === 'string'){
      path = path.split('.')
    }

    let data = this.state;

    for (let s in this.subs['']) {
      this.subs[''][s](data);
    }

    for(let i in path) {
      let key = path.slice(0, i+1).join('.');
      for (let s in this.subs[key]) {
        this.subs[key][s](data[path[i]]);
      }
      data = typeof data === 'object' ? data[path[i]] : undefined;
    }
  }
}

export default DataStore;