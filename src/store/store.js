import {getChild} from './path.helper';
import StoreNode from './store-node';

export default class Store extends StoreNode {
  constructor(state, binding) {
    super();
    this.binding = binding;
    this.load(state);
  }

  load(value) {
    if (this.binding) {
      let result = this.binding.load();
      if (result) {
        this.set({
          ...value,
          ...result,
        });
      }
    }
    return this.set(value);
  }

  save() {
    if (this.binding) {
      this.binding.save(this.value);
    }
  }

  set(value, path = undefined, ignoreParent = false) {
    super.set(value, path, ignoreParent);
    this.save();
  }
}