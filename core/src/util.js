import Renderer from './renderer';
import {NAMESPACES} from './helpers';

export const prepareEnvironment = () => {
  if (typeof document === 'undefined') {
    const createElement = (namespace, tag) => {
      const element = {
        props: {
          xmlns: !namespace || namespace === NAMESPACES.html ? undefined : namespace,
        },
        listeners: {},
        childNodes: [],
        functions: {
          addEventListener: (name, callback) => {
            element['on' + name] = callback;
          },
          removeEventListener: (name, callback) => {
            element['on' + name] = undefined;
          },
          insertBefore: (newChild, before) => {
            console.log('insertBefore');
            const index = element.childNodes.indexOf(before);
            if (index >= 0) {
              element.childNodes.splice(index, 0, newChild);
            }
            else {
              element.childNodes.push(newChild);
            }
          },
          appendChild: (node) => {
            console.log('appendChild');
            element.childNodes.push(node);
          },
          replaceChild: (newChild, oldChild) => {
            console.log('replaceChild');
            const index = element.childNodes.indexOf(oldChild);
            if (index >= 0) {
              element.childNodes.splice(index, 1, newChild);
            }
          },
          removeChild: (node) => {
            const index = element.childNodes.indexOf(node);
            if (index >= 0) {
              element.childNodes.splice(index, 1);
            }
          },
          isSameNode: (node) => {
            return element === node;
          },
          setAttribute: (name, value) => {
            element.props[name] = value;
          },
        },
        outerHTML: () =>
          `<${tag} ${Object.keys(element.props)
            .filter(key => key && element.props[key] !== undefined)
            .map(key => `${key}="${element.props[key]}"`)
            .join(' ')}>`
          + (
            element.childNodes
              ? element.childNodes.map(
              child => child && child.outerHTML,
              ).join('')
              : ''
          )
          + `</${tag}>`,
      };

      const get = (target, name) => {
        if (!name || typeof name === 'symbol') {
          return target;
        }
        else if (name === 'outerHTML') {
          return target.outerHTML();
        }
        else if (name === 'childNodes') {
          return target.childNodes;
        }
        else if (name.startsWith('on')) {
          return target.listeners[name.slice(2)];
        }
        else if (target.functions[name]) {
          return target.functions[name];
        }
        else {
          return target.props[name];
        }
      };

      const set = (target, name, value) => {
        if (name === 'outerHTML') {
          throw new Error('can\'t set outer HTML');
        }
        else if (name === 'childNodes') {
          target.childNodes = value;
        }
        else if (name.startsWith('on')) {
          target.listeners[name.slice(2)] = value;
        }
        else {
          target.props[name] = value;
        }
        return true;
      };


      return new Proxy(element, {get, set});
    };

    global.document = {
      createTextNode: (text) => ({outerHTML: text}),
      createElementNS: createElement,
      createElement: tag => createElement(NAMESPACES.html, tag),
      querySelector: (selector) => {
        if (selector === 'head') {
          return document.head;
        }
        if (selector === 'body') {
          return document.body;
        }
      },
      head: createElement(NAMESPACES.html, 'head'),
      body: createElement(NAMESPACES.html, 'body'),
    };
    global.window = {};
  }
};

prepareEnvironment();