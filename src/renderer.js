import BasicComponent from './basic.component';
import { directivePropMap, flattenDeepArray, NAMESPACES } from './helpers';
import Pointer from './store/Pointer';
import { ElementProxy } from './element.proxy';

export const Renderer = {
  create: (tag, props, ...children) => {
    if (!props) props = {};

    children = flattenDeepArray(children);

    let namespace = NAMESPACES[tag];

    return {
      tag,
      namespace,
      props,
      children,
    };
  },

  render: (root, appendTo, store) => {
    const node = Renderer.renderNode(root, store);
    appendTo.append(
      node
    );
  },

  renderNode(node, store) {
    if (!node) return null;

    const {
      tag,
      namespace,
      props,
      children,
    } = node;


    // DATA =========================================

    let data = tag && tag.data;
    if(typeof data === 'function') {
      data = data(props);
    }

    data = data
      ? Object.keys(data).reduce(
        (acc, key) => {
          acc[key] = data[key] instanceof Pointer
            ? data[key]
            : store.getPointer(data[key]);
          return acc;
        }, {})
      : {};


    // ELEMENT =========================================

    let element = null;
    switch (typeof tag) {
      case 'string':
        element = new ElementProxy(
          namespace && namespace !== NAMESPACES.html
            ? document.createElementNS(namespace, tag)
            : document.createElement(tag)
        );
        break;
      case 'function':
        return Renderer.renderNode(tag({ ...props, children }, data), store);
      default:
        console.error('Unknown jsx tag: ' + tag);
        return null;
    }


    // PROPS =========================================

    if (props) {
      for (let attr in props) {
        element.set(attr, props[attr]);
      }
    }

    // CHILDREN =========================================

    if (children) {
      let flatChildren = flattenDeepArray(children);
      flatChildren.forEach(
        (child, index) => {
          let childElement = Renderer.createElement(child, namespace, store);
          if (!childElement && child && child instanceof Pointer) {
            child.subscribe((result) => {
              if (Array.isArray(result)) {
                element.setChild(
                  index,
                  ...result.map(
                    child => Renderer.createElement(child, namespace, store)
                  )
                );
              }
              else {
                element.setChild(index, Renderer.createElement(result, namespace, store));
              }
            }, true);
          }
          else {
            element.setChild(index, childElement);
          }
        }
      )
    }

    return element.element;
  },

  createElement(src, namespace, store) {
    switch (typeof src) {
      case 'string':
        return document.createTextNode(src);
      case 'function':
        return Renderer.renderNode(src, store);
      case 'object':
        if (!(src instanceof Pointer)) {
          if (!src.namespace) {
            src = { ...src, namespace };
          }
          return Renderer.renderNode(src, store);
        }
        break;
    }
  }
};


export default Renderer;