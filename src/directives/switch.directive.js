import AbstractDirective from './abstract.directive';

export default class SwitchDirective extends AbstractDirective {

  constructor(component, value) {
    super(component, value);
    this.currentCase = undefined;
  }

  init(data, path, store) {
    this.update(data, path);
  }

  destroy() {
  }

  update(data, path) {
    const newCase = typeof this.value === 'function' ? this.value(data, path) : this.value === data;
    if (this.currentCase !== newCase) {
      this.switch(data, path, newCase);
    }

    this.component.updateProps(data, path);
    this.component.updateChildren(data, path);
  }

  switch(data, path, newCase) {
    this.currentCase = newCase;

    this.component.removeAllChildren();
    if (this.component.childrenFactories) {
      let foundMatch = false;
      let factories =
        this.component.childrenFactories.filter(
          (compConf) => {
            if (compConf && compConf.props) {
              if (compConf.props._case !== undefined || compConf.props._default) {
                if (compConf.props._case === newCase) {
                  foundMatch = true;
                  return true;
                }
                return !foundMatch && compConf.props._default
              }
              return true;
            }
          }
        );

      this.component.children = this.component.createNewChildren(factories);
      this.component.children.forEach(child => {
        child.parent = this.component;
        child.init(data, path, this.component.store);
      });
      this.component.appendChildren();
    }
  }
}