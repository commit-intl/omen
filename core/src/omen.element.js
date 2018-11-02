import Renderer from './renderer';
import { htmlPropSet, NAMESPACES, htmlPropMap } from './helpers';
import DataNode from './store/data-node';

export default class OmenElement {
  constructor(tag, namespace, props, data, children, store) {
    this.tag = tag;
    this.namespace = namespace;
    this.props = props || {};
    this.data = data || {};
    this.children = children || [];
    this.store = store;
    this.subscriptions = [];

    this.elementProps = {};
    this.elementListeners = {};
    this.elementChildren = [];

    this.initElement();
    this.initProps();
    this.initChildren();
  }

  initElement() {
    if (typeof this.tag === 'string') {
      this.element = this.namespace && this.namespace !== NAMESPACES.html
        ? document.createElementNS(this.namespace, this.tag)
        : document.createElement(this.tag);
    }
    else {
      console.error('Unknown jsx tag: ' + this.tag);
    }
  }

  initProps() {
    for (let attr in this.props) {
      this.setAttribute(attr, this.props[attr]);
    }
  }

  initChildren() {
    const setChild = (pos, children) => {
      if (!Array.isArray(children)) {
        children = [children];
      }

      this.setChild(pos, ...children);
    };

    this.children.forEach(
      (child, index) => {
        if (!child) return;

        if (child.__isDataNode) {
          const map = new WeakMap();
          this.subscriptions.push(
            child.subscribe((result) => {
              if (!result) return;
              if (Array.isArray(result)) {
                setChild(
                  index,
                  result.map(child => {
                    let element = map.get(child);
                    if (!element) {
                      element = Renderer.createElement(child, this.namespace, this.store);
                      map.set(child, element);
                    }
                    return element;
                  }),
                );
              }
              else {
                setChild(index, Renderer.createElement(result, this.namespace, this.store));
              }
            }, true),
          );
        }
        else {
          let childElement = Renderer.createElement(child, this.namespace, this.store);
          setChild(index, childElement);
        }
      },
    )
  }

  setAttribute(key, value) {
    if (value && value.__isDataNode) {
      this.subscriptions.push(
        value.subscribe((result) => this.setAttribute(key, result), true),
      );
    }
    else if (key.startsWith('on')) {
      let event = key.substr(2).toLowerCase();
      if (this.elementListeners[event]) {
        if (value !== this.elementListeners[event]) {
          this.element.removeEventListener(this.listeners[event]);
          this.element.addEventListener(event, value);
        }
      }
      else {
        this.element.addEventListener(event, value);
      }
    }
    else {
      if (htmlPropMap[key]) {
        value = htmlPropMap[key](value);
      }

      if (this.elementProps[key] !== value) {
        if (htmlPropSet.indexOf(key) >= 0) {
          this.element[key] = value;
        }
        else if (key === 'className') {
          if (this.element.namespaceURI !== NAMESPACES.html) {
            this.element.setAttribute('class', value);
          }
          else {
            this.element[key] = value;
          }
        }
        else {
          this.element.setAttribute(key, value);
        }
      }

      this.elementProps[key] = value;
    }
  }

  get(key, value) {
    return this.elementProps[key];
  }

  removeAllChidren() {
    let c = 0;
    for (let pos = 0; pos < this.children.length; pos++) {
      for (let i = 0; i < this.children[pos].length; i++) {
        let node = this.element.childNodes[c++];
        if (node) {
          return this.element.removeChild(node);
        }
      }
    }
  }

  setChild(pos, ...children) {
    const getNode = (child) => child instanceof OmenElement ? child.element : child;

    let prevIndex = 0;
    for (let i = 0; i < this.elementChildren.length && i < pos; i++) {
      prevIndex += this.elementChildren[i] ? this.elementChildren[i].length : 0;
    }

    let group = this.elementChildren[pos] || [];

    if (this.element.childNodes !== undefined) {
      let i = 0;
      while (i < group.length) {
        const currentNode = this.element.childNodes[prevIndex + i];
        const newNode = getNode(children[i]);
        if (i < children.length) {
          if (currentNode) {
            if (!currentNode.isSameNode(newNode)) {
              this.element.replaceChild(newNode, currentNode);
              if (group[i] && group[i].destroy) {
                group[i].destroy();
              }
              group[i] = children[i];
            }
          }
          else {
            this.element.insertBefore(newNode, null);
          }
        } else if (currentNode) {
          this.element.removeChild(currentNode);
          if (group[i] && group[i].destroy) {
            group[i].destroy();
          }
          group[i] = undefined;
        }
        i++;
      }

      const insertBeforeIndex = prevIndex + group.length;
      const insertBefore = this.element.childNodes[insertBeforeIndex];

      while (i < children.length) {
        const newNode = getNode(children[i]);
        if (newNode) {
          this.element.insertBefore(newNode, insertBefore);
          group[i] = children[i];
        }
        i++;
      }

      this.elementChildren[pos] = group.filter(g => g);
    }
  }

  appendChild(...children) {
    this.setChild(this.elementChildren.length, ...children);
  }

  destroy() {
    if (this.subscriptions) {
      this.subscriptions.forEach(sub => sub());
    }
    this.subscriptions = [];

    if (this.elementChildren) {
      this.elementChildren.forEach(
        group => group && group.forEach(
          child => child && child.destroy && child.destroy()
        )
      );
    }

    this.elementChildren = [];
  }
}