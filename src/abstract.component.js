import { cloneDeep, flattenDeepArray } from './helpers';


export class AbstractComponent {
  constructor(elementFactory, props, childrenFactories, namespace) {
    this.parent = undefined;
    this.elementFactory = elementFactory;
    this.initialProps = props;
    this.props = cloneDeep(props);
    this.listeners = [];
    this.childrenFactories = flattenDeepArray(childrenFactories);
    this.children = [];
    this.namespace = namespace;
    this.currentData = undefined;
    this.currentPath = undefined;
    this.store = undefined;
  }

  init(data, path, store) {
    this.store = store;
    this.currentData = data;
    this.currentPath = path;
    this.element = this.elementFactory(this.namespace);
  }

  initChildren(data, path, store) {
    this.children = this.createNewChildren();

    for (let i in this.children) {
      if (typeof this.children[i] === 'object') {
        if (!this.children[i].parent) this.children[i].parent = this;
        if (this.children[i].init) this.children[i].init(data, path, store);
      }
    }

    this.appendChildren();
  }

  createNewChildren(childFactories) {
    let factories = childFactories || this.childrenFactories;
    return factories
      && factories.map(f => {
        if (typeof f === 'object' && typeof f.create === 'function') return f.create(this.namespace);
        return f;
      });
  }

  appendChildren(from = 0) {
    for (let i = from; i < this.children.length; i++) {
      let child = this.children[i];
      switch (typeof child) {
        case 'object':
          this.element.appendChild(child.element);
          break;
        case 'function':
          let target = this.element;
          if (this.children.length !== 1) {
            target = document.createElement('span');
            this.element.appendChild(target);
          }
          const updateFunction = child;
          this.children[i] = (data, path) => {
            const result = updateFunction(data, path);
            target.innerHTML = result;
          };
          this.children[i](this.currentData, this.currentPath);
          break;
        default:
          if (child != null && child !== false) {
            this.element.append(child);
          }
      }
    }
  }

  removeChild(child) {
    this.children = this.children.filter(c => c !== child);
    if (child && child.element && this.element) {
      this.element.removeChild(child.element);
    }
  }

  removeAllChildren() {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
    this.children = [];
  }

  render() {
    return this.element;
  }

  update(data, path) {
    this.currentData = data;
    this.currentPath = path;
  }

  hide() {
    if (!this.hidden) {
      if (this.element) {
        this.element.hidden = this.hidden = true;
        this.removeAllChildren();
      }
    }
  }

  show() {
    if (this.hidden || this.children.length <= 0) {
      if (this.element) {
        this.element.hidden = this.hidden = false;
        console.log('show', this.currentData, this.currentPath, this.store);
        this.initChildren(this.currentData, this.currentPath, this.store);
        this.update(this.currentData, this.currentPath);
      }
    }
  }

  destroy(root = true) {
    if (root && this.parent) {
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