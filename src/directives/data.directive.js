import AbstractDirective from './abstract.directive';

export default class DataDirective extends AbstractDirective {
  constructor(component, value) {
    super(component, value);
    this.currentData = undefined;
  }

  init(data, path) {
    this.update(this.component.currentData, this.component.currentPath);
  }

  update(data, path) {
    const newData = typeof this.value === 'function'
      ? this.value(data, path)
      : this.value;

    this.component.updateProps(newData,path);
    this.component.updateChildren(newData,path);
  }

  destroy() {}
}