import AbstractComponent from './abstract.component';
import {cloneDeep} from "./helpers";

export class ControlComponent extends AbstractComponent {
  constructor(element, props, children) {
    super(element, props, children);

    this.listeners = [];
  }

  init(store) {
    super.init(store);

    if(this.props.bind) {
      this.bind(this.props.bind)
    }
  }

  bind(path) {
    if(this.store && path) {
      let handler = (data) => {
        this.update(data);
      };

      this.store.addListener(
        path,
        handler
      );

      this.listeners.push({path, handler});
    }
  }

  forOf(path) {
    if(this.store && path) {
      let handler = (data) => {

        this.update(data);
      };

      this.store.addListener(
        path,
        handler
      );

      this.listeners.push({path, handler});
    }
  }

  destroy() {
    for(let i in this.listeners) {
      this.store.removeListener(this.listeners[i].path, this.listeners[i].handler);
    }
    this.listeners = [];
    super.destroy();
  }

  clone() {

    let clonedChildren = this.children.map(child => child.clone());


    return new ControlComponent(this.elementFactory, cloneDeep(this.props), clonedChildren);
  }
}

export default ControlComponent;