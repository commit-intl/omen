import { HTML_SPECIAL_ATTRIBUTES, htmlPropMap, isNode, NAMESPACES } from './helpers';
import Observable from './observable/Observable';


export class ElementProxy {

  constructor(element) {
    this.element = element;
    this.currentProps = {};
    this.currentListeners = {};

    const attributes = this.element.attributes;
    for (let i = 0; i < attributes.length; i++) {
      const attribute = att = attributes[i];
      this.currentProps[attribute.nodeName] = attribute.nodeValue;
    }

    this.childMap = [];
    if (this.element.childNodes) {
      for (let i = 0; i < this.element.childNodes.length; i++) {
        this.childMap[i] = 1;
      }
    }
  }

  set(key, value) {
    if (value instanceof Observable) {
      value.subscribe((result) => this.set(key, result), true);
    }
    else if (key.startsWith('on')) {
      let event = key.substr(2).toLowerCase();
      if (this.currentListeners[event]) {
        if (value !== this.currentListeners[event]) {
          this.element.removeEventListener(this.currentListeners[event]);
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

      if (this.currentProps[key] !== value) {
        if (HTML_SPECIAL_ATTRIBUTES.indexOf(key) >= 0) {
          this.element[key] = value;
        }
        else if (key === 'className') {
          if (this.element.namespaceURI !== NAMESPACES) {
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

      this.currentProps[key] = value;
    }
  }

  get(key, value) {
    return this.currentProps[key];
  }

  removeAllChidren() {
    for (let pos = 0; pos < this.childMap.length; pos++) {
      for (let i = 0; i < this.childMap[pos]; i++) {
        let node = this.element.childNodes[pos];
        if (node) {
          return this.element.removeChild(node);
        }
      }
    }
  }

  removeChildByPos(pos) {
    if (this.element.hasChildNodes() && this.element.childNodes[pos]) {
      return this.element.removeChild(this.element.childNodes[pos]);
    }
  }

  setChild(pos, ...children) {
    let prevIndex = 0;
    for (let i = 0; i < this.childMap.length && i < pos; i++) {
      prevIndex += this.childMap[i] || 0;
    }

    if (this.childMap[pos]) {
      for (let i = 0; i < this.childMap[pos]; i++) {
        this.removeChildByPos(prevIndex + i);
      }
    }

    this.childMap[pos] = children.length;
    let injectBefore = this.element.childNodes[prevIndex];
    for (let i = 0; i < children.length; i++) {
      if (children[i]) {
        if (isNode(children[i])) {
          this.element.insertBefore(children[i], injectBefore);
        }
        else {
          this.element.insertBefore(document.createTextNode(children[i]+''), injectBefore);
        }
      }
      else {
        this.element.insertBefore(document.createTextNode(''), injectBefore);
      }
    }
  }

  appendChild(...children) {
    this.setChild(this.childMap.length, ...children);
  }
}