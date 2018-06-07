

export class AbstractComponent {
  constructor(element, props, children) {
    this.parent = undefined;
    this.element = element;
    this.props = props;

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
}

export default AbstractComponent