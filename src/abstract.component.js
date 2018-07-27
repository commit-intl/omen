import { cloneDeep } from './helpers';


export class AbstractComponent {
  constructor(elementFactory, props, childrenFactories) {
    this.parent = undefined;
    this.elementFactory = elementFactory;
    this.initialProps = props;
    this.props = cloneDeep(props);
    this.listeners = [];
    this.childrenFactories = childrenFactories;
    this.children = [];
    this.currentData = undefined;
    this.currentPath = undefined;
  }

  init(store) {
    this.store = store;
    this.element = this.elementFactory();
  }

  removeChild(child) {
    this.children = this.children.filter(c => c !== child);
    if(child && child.element && this.element) {
      this.element.removeChild(child.element);
    }
  }

  render() {
    return this.element;
  }

  update(data, path) {
    this.currentData = data;
    this.currentPath = path;
  }

  hide() {
    if(!this.hidden) {
      if(this.element) {
        this.element.hidden = this.hidden = !this.hidden;
      }
    }
  }

  show() {
    if(this.hidden) {
      if(this.element) {
        this.element.hidden = this.hidden = !this.hidden;
      }
    }
  }

  destroy(root = true) {
    if(root && this.parent) {
      this.parent.removeChild(this);
    }

    this.listeners = [];

    for (let i in this.children) {
      if (this.children[i].destroy) {
        this.children[i].destroy(false);
      }
    }
  }
}

export default AbstractComponent