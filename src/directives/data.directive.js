import AbstractDirective from './abstract.directive';

export default class DataDirective extends AbstractDirective {
  constructor(component, value) {
    super(component, value);
    this.currentData = undefined;
  }

  init() {
    if(typeof value !== 'function') {
      this.component.update(value, this.component.currentPath);
      this.component.updateProps(value, this.component.currentPath);
    }
  }

  update(data, path, call) {
    if (typeof this.value === 'function') {
      let newData = this.value(data, path);
      if (this.currentData !== newData) {
        this.currentData = newData;
        this.component.updateProps(data, path);
        this.component.updateChildren(data, path);
      }
    }
  }

  destroy() {}
}