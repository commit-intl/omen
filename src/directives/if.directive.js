import AbstractDirective from './abstract.directive';

export default class IfDirective extends AbstractDirective {

  constructor(component, value) {
    super(component, value);
    this.currentData = undefined;
  }

  init() {}
  destroy() {}

  update(data, path, call) {
    if (typeof this.value === 'function') {
      let newCase = this.value(data, path);
      if (this.currentData !== newCase) {
        this.switch(newCase);
      }
    }

    this.component.updateProps(data, path);
    this.component.updateChildren(data, path);
  }

  _if(data, path) {
    let _if = this.props._if;
    const result = typeof _if === 'function' ? _if(data, path) : _if === data;

    if (result) {
      this.show();
    }
    else {
      this.hide();
    }
  }
}