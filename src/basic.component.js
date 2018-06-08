import AbstractComponent from './abstract.component';
import { cloneDeep, htmlPropMap } from './helpers';


export class BasicComponent extends AbstractComponent {

  constructor(elementFactory, props, children) {
    super(elementFactory, props, children);
  };

  render() {
    return this.element;
  }

  update(data, path) {
    this.updateProps(data);
    super.update(data, path);

    for (let i in this.children) {
      if(this.children[i].update) {
        this.children[i].update(data, path);
      }
    }
  }

  updateProps(data) {
    for (let i in this.props) {
      let value = typeof this.props[i] === 'function' ? this.props[i](data) : this.props[i];
      if (htmlPropMap[i]) {
        value = htmlPropMap[i](this.props[i]);
      }
      this.element[i] = value;
    }
  }

  init(store) {
    super.init(store);

    let newProps = {};

    for (let attr in this.props) {
      if (attr.indexOf('on') === 0) {
        const eventHandler = (handler) => (event) => handler(event, this.currentData, this.currentPath);
        this.listeners[attr.substr(2).toLowerCase()] = eventHandler(this.props[attr]);
      } else {
        newProps[attr] = this.props[attr];
      }
    }

    this.props = newProps;

    for (let i in this.children) {
      switch (typeof this.children[i]) {
        case 'string':
          this.element.append(this.children[i]);
          break;
        case 'function':

          let target = this.element;
          if(this.children.length !== 1) {
            target = document.createElement('span');
            this.element.appendChild(target);
          }
          this.onUpdate.push((data) => {
            target.innerHTML = this.children[i](data);
          });
          break;
        default:
          this.element.appendChild(this.children[i].element);
      }
    }

    for (let i in this.listeners) {
      this.element.addEventListener(i, this.listeners[i]);
    }

    this.updateProps(undefined);
  }

  clone() {
    let clonedChildren = this.children.map(child => child.clone ? child.clone() : child);
    return new BasicComponent(this.elementFactory, cloneDeep(this.initialProps), clonedChildren);
  }
}

export default BasicComponent;