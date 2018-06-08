import AbstractComponent from './abstract.component';

const mapping = {
  'style': (value) => {
    let result = '';
    for (let i in value) {
      result += i.replace(/([A-Z])/g, '-$1').toLowerCase() + ':' + value[i] + ';';
    }
    return result;
  }
};

export class BasicComponent extends AbstractComponent {

  constructor(element, props, children, listeners, onUpdate) {
    super(element, props, children, listeners, onUpdate);

    for ( let i in children ) {
      children[i].parent = this;
    }
  };

  render() {
    this.update();
    return this.element;
  }

  update(data) {
    let props = {};
    for (let i in this.props) {
      props[i] = typeof this.props[i] === 'function' ? this.props[i](data) : this.props[i];
      if (mapping[i]) {
        props[i] = mapping[i](props[i]);
      }
      this.element[i] = props[i];
    }

    for (let i in this.onUpdate) {
      this.onUpdate[i](data);
    }

    super.update(data);
  }

  init(store) {
    super.init(store);

    for (let i in this.listeners) {
      this.element.addEventListener(i, this.listeners[i]);
      console.log('registered', i, this.listeners[i])
    }
  }
}

export default BasicComponent;