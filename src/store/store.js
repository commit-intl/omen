import Pointer from './Pointer';
import {getChild} from './path.helper';

export class Store {

  constructor(state, binding) {
    this.state = state;
    this.binding = binding;
    this.pointers = {};

    this.load();
  }

  load() {
    if (this.binding) {
      let result = this.binding.load();
      if (result) {
        this.state = {
          ...this.state,
          ...result,
        };
      }
    }
  }

  save() {
    if (this.binding) {
      this.binding.save(this.state);
    }
  }

  get(path) {
    return getChild(this.state, path);
    ;
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
            parent.splice(path[path.length - 1], 1)
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

  getPointer(path, options) {
    path = (path || '');
    if (!this.pointers[path]) {
      this.pointers[path] = {};
    }

    let key = JSON.stringify(options || '');
    if (!this.pointers[path][key]) {
      let pointer = new Pointer(this, path, options);
      this.pointers[path][key] = {
        pointer,
        options,
      };

      pointer.update(this.get(path));
    }

    return this.pointers[path][key].pointer;
  }

  removePointer(path, options) {
    if (this.pointers[path]) {
      let key = JSON.stringify(options || null);
      if (this.pointers[path][key]) {
        delete this.pointers[path][key];
      }
    }
  }

  notify(path) {
    if (typeof path === 'string') {
      path = path.split('.')
    }
    console.log('notify path', path, this.pointers);

    let data = this.state;

    for (let opts in this.pointers['']) {
      const options = this.pointers[''][opts].options;
      if (
        !options
        || (options.depth != null && options.depth >= path.length)
      ) {
        this.pointers[''][opts].pointer.update(data);
        console.log('notify path pointer', path);
      }
    }

    for (let i = 0; i < path.length; i++) {
      let key = path.slice(0, i + 1).join('.');
      console.log('notify path', key);
      if (this.pointers[key]) {
        for (let opts in this.pointers[key]) {
          const listener = this.pointers[key][opts];
          const options = listener.options;
          if (
            !options
            || (options.depth != null && options.depth >= (path.length - i - 1))
          ) {
            listener.pointer.update(data[path[i]]);
            console.log('notify path pointer', path);
          }
        }
      }
      data = typeof data === 'object' ? data[path[i]] : undefined;
    }
  }
}

export default Store;