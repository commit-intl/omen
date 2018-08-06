import AbstractDirective from './abstract.directive';

export default class SwitchDirective extends AbstractDirective {

  constructor(component, value) {
    super(component, value);
    this.currentCase = undefined;
  }

  init() {}
  destroy() {}

  update(data, path, call) {
    if (typeof this.value === 'function') {
      let newCase = this.value(data, path);
      if (this.currentCase !== newCase) {
        this.switch(newCase);
      }
    }

    this.component.updateProps(data, path);
    this.component.updateChildren(data, path);
  }

  switch(newCase) {
    this.currentCase = newCase;

    this.component.removeAllChildren();
    if (this.component.children) {
      this.component.createNewChildren(
        this.component.children.filter(
          (compConf) =>
            compConf && compConf.props
            && (compConf.props._case === newCase || compConf.props._default)
        )
      );
    }
  }
}