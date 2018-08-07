import AbstractDirective from './abstract.directive';

export default class SwitchDirective extends AbstractDirective {

  constructor(component, value) {
    super(component, value);
    this.currentCase = undefined;
  }

  init(data, path, store) {
    this.update(data, path);
  }

  destroy() {}

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

    console.log('switch', path, data, newCase);
    this.component.removeAllChildren();
    if (this.component.childrenFactories) {
      let foundMatch = false;
      this.component.createNewChildren(
        this.component.childrenFactories.filter(
          (compConf) => {
            if(compConf && compConf.props) {
              if(compConf.props._case === newCase){
                foundMatch = true;
                return true;
              }
              else if(compConf.props._default && !foundMatch) {
                return true;
              }
            }
          }
        )
      );

      this.component.children.forEach(child => child.init(data, path, this.component.store));
    }
  }
}