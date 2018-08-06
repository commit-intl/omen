import AbstractDirective from './abstract.directive';

export default class BindDirective extends AbstractDirective {

  constructor(component, value) {
    super(component, value);
    this.storeBinding = undefined;
    this.boundPath = undefined;
    this.combiner = undefined;
  }

  init() {
    if (typeof this.value === 'function' || (this.value && this.value[0] === '.')) {
      this.combiner =
        typeof this.value === 'function'
          ? (data, path) => this.value(data, path)
          : (data, path) => path + this.value;
    }
    else {
      this.combiner = () => this.value;
    }
  }

  update(data, path, call) {
    let newPath = this.combiner(data, path);
    if (this.boundPath !== newPath) {
      this.bind(newPath);
    }
  }

  bind(path) {
    if (this.storeBinding) {
      this.component.store.removeListener(this.storeBinding.path, this.storeBinding.handler);
      this.storeBinding = null;
    }

    this.boundPath = path;

    let handler = (data) => {
      this.component.updateProps(data, this.boundPath);
      this.component.updateChildren(data, this.boundPath);
    };

    this.store.addListener(
      path,
      handler,
    );

    this.storeBinding = { path: path, handler };
  }

  destroy() {
    if(this.storeBinding) {
      this.component.store.removeListener(this.storeBinding.path, this.storeBinding.handler);
    }
  }
}