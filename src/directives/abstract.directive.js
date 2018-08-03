

export default class AbstractDirective {

  constructor(component, value) {
    this.component = component;
    this.value = value;
  }

  update(data, path) {
    console.warn('UPDATE() NOT DEFINED IN DIRECTIVE');
  }
}