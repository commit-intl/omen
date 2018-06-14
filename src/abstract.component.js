import { cloneDeep } from './helpers';


export class AbstractComponent {
  constructor(elementFactory, props, children) {
    this.parent = undefined;
    this.elementFactory = elementFactory;
    this.initialProps = props;
    this.props = props;
    this.listeners = [];
    this.onUpdate = [];
    this.children = children;
    this.currentData = undefined;
    this.currentPath = undefined;

    for ( let i in this.children ) {
      if(typeof this.children[i] === 'object') {
        this.children[i].parent = this;
      }
    }
  }

  init(store) {
    this.store = store;

    for (let i in this.children) {
      if(this.children[i].init) {
        this.children[i].init(store);
      }
    }

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

    for (let i in this.onUpdate) {
      this.onUpdate[i](data, path);
    }
  }

  destroy(root = true) {
    if(root && this.parent) {
      this.parent.removeChild(this);
    }

    this.listeners = [];
    this.onUpdate = [];

    for (let i in this.children) {
      if (this.children[i].destroy) {
        this.children[i].destroy(false);
      }
    }
  }
}

export default AbstractComponent