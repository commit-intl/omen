

export default class AbstractDirective {

  constructor(component, value) {
    this.component = component;
    this.value = value;
  }

  init() {
    console.warn('init() NOT DEFINED IN DIRECTIVE');
  }

  update(data, path) {
    console.warn('update() NOT DEFINED IN DIRECTIVE');
  }

  destroy() {
    console.warn('destroy() NOT DEFINED IN DIRECTIVE');
  }
}