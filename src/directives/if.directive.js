import AbstractDirective from './abstract.directive';

export default class IfDirective extends AbstractDirective {

  constructor(component, value) {
    super(component, value);
    this.currentState = undefined;
  }

  init(data, path, store) {
    this.update(data, path)
  }
  destroy() {}

  update(data, path) {
    const state = typeof this.value === 'function' ? !!this.value(data, path) : this.value === data;
    console.log('if', this.currentState, state, this.value);
    if (this.currentState !== state) {
      this.currentState = state;

      if (state) {
        this.component.show();
      }
      else {
        this.component.hide();
      }
    }

    this.component.updateProps(data, path);
    this.component.updateChildren(data, path);
  }
}