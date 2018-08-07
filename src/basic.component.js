import AbstractComponent from './abstract.component';
import { cloneDeep, directivePropMap, htmlPropMap } from './helpers';

export const hashCode = function (string) {
  var hash = 0;
  for (var i = 0; i < string.length; i++) {
    var character = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + character;
    hash = hash & hash; // Convert to 32bit integer
  }

  hash &= 0x7FFFFFFF;

  return hash.toString(36);
};

export class BasicComponent extends AbstractComponent {

  constructor(elementFactory, props, childrenFactories, namespace) {
    super(elementFactory, props, childrenFactories, namespace);
    this.currentProps = {};
    this.directives = [];
  };

  init(data, path, store) {
    super.init(data, path, store);

    let newProps = {};
    for (let attr in this.props) {
      if (attr.indexOf('on') === 0) {
        const eventHandler = (handler) => (event) => handler(event, this.currentData, this.currentPath);
        this.listeners[attr.substr(2).toLowerCase()] = eventHandler(this.props[attr]);
      } else if (attr[0] === '_' && directivePropMap[attr]) {
        this.directives.push(new directivePropMap[attr](this, this.props[attr]));
        newProps['data-'+attr.slice(1)] = typeof this.props[attr] === 'function' ? '' : this.props[attr];
      } else {
        newProps[attr] = this.props[attr];
      }
    }
    this.props = newProps;

    for (let i in this.listeners) {
      this.element.addEventListener(i, this.listeners[i]);
    }

    if (this.directives.length > 0) {
      this.directives.forEach(dir => dir.init(this.currentData, this.currentPath, store));
    }
    else {
      this.initChildren(this.currentData, this.currentPath, store);
      this.updateProps(this.currentData, this.currentPath);
    }
  }

  render() {
    return this.element;
  }

  update(data, path, selfCall = false) {
    super.update(data, path);

    if (this.directives.length > 0) {
      this.directives.forEach(dir => dir.update(data, path));
    }
    else {
      this.updateProps(data, path);
      this.updateChildren(data, path);
    }
  }

  updateChildren(data, path) {
    for (let i in this.children) {
      this.updateChild(this.children[i], data, path);
    }
  }

  updateProps(data, path) {
    for (let i in this.props) {
      let value = typeof this.props[i] === 'function' ? this.props[i](data, path) : this.props[i];
      if (htmlPropMap[i]) {
        value = htmlPropMap[i](this.props[i]);
      }

      if (this.currentProps[i] !== value) {
        if (i === 'style' || i === 'value') {
          this.element[i] = value;
        }
        else if (i === 'className') {
          if (this.namespace) {
            this.element.setAttribute('class', value);
          }
          else {
            this.element[i] = value;
          }
        }
        else {
          this.element.setAttribute(i, value);
        }
      }
      this.currentProps[i] = value;
    }
  }

  updateChild(child, data, path) {
    switch (typeof child) {
      case 'object':
        child.update(data, path);
        break;
      case 'function':
        child(data, path);
        break;
    }
  }

  clone() {
    return new BasicComponent(this.elementFactory, cloneDeep(this.initialProps), this.childrenFactories);
  }

  destroy(root) {
    super.destroy(root);

    if (this.directives.length > 0) {
      this.directives.forEach(dir => dir.destroy());
    }
  }
}

export default BasicComponent;