import AbstractDirective from './abstract.directive';

export default class BindDirective extends AbstractDirective {

  constructor(component, value) {
    super(component, value);
    this.storeBinding = undefined;
    this.boundPath = undefined;
    this.combiner = undefined;
  }

  init(data, path, store) {
    if (typeof this.value === 'function' || (this.value && this.value[0] === '.')) {
      this.combiner =
        typeof this.value === 'function'
          ? (data, path) => this.value(data, path)
          : (data, path) => path != null && path + this.value;
    }
    else {
      this.combiner = () => this.value;
    }

    this.update(data,path);
  }

  update(data, path) {
    let newPath = this.combiner(data, path);
    if (this.boundPath !== newPath) {
      this.bind(newPath);
    }
  }

  destroy() {
    if(this.storeBinding) {
      this.component.store.removePointer(this.storeBinding.path, this.storeBinding.handler);
    }
  }

  bind(path) {
    if (this.storeBinding) {
      this.component.store.removePointer(this.storeBinding.path, this.storeBinding.handler);
      this.storeBinding = null;
    }

    this.boundPath = path;


    let handler = (data) => {
      if(this.component.children && this.component.children.length <= 0) {
        this.component.initChildren(data, this.boundPath,  this.component.store);
      }
      this.component.updateProps(data, this.boundPath);
      this.component.updateChildren(data, this.boundPath);
    };

    this.component.store.addListener(
      path,
      handler,
    );

    this.storeBinding = { path, handler };
  }
}