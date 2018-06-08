

export class AbstractComponent {
  constructor(elementFactory, props, children, listeners, onUpdate) {
    this.parent = undefined;
    this.elementFactory = elementFactory;
    this.element = elementFactory();
    this.props = props;
    this.listeners = listeners;
    this.onUpdate = onUpdate;

    this.children = children;
    for ( let i in this.children ) {
      this.children[i].parent = this;
    }
  }

  init(store) {
    this.store = store;

    for (let i in this.children) {
      this.children[i].init(store);
    }
  }

  removeChild(child) {
    this.children = this.children.filter(c => c !== child);
  }

  render() {
    return this.element;
  }

  update(data) {
    for (let i in this.children) {
      this.children[i].update(data);
    }
  }

  destroy() {
    this.parent.removeChild(this);
    this.element.parentNode.removeChild(this.element);
  }

  clone() {
    console.log('TODO: override Component.clone()');
  }
}

export default AbstractComponent