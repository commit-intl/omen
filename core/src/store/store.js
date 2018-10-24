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
        return this.set({
          ...value,
          ...result,
        });
      }
    }
    return this.set(value);
  }

  save() {
    console.log('save', this.value);
    if (this.binding) {
      this.binding.save(this.value);
    }
  }

  notify(propagateUp = true, propagateDown = true) {
    super.notify(propagateUp, propagateDown);
    this.save();
  }
}