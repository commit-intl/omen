import {flattenDeepArray, NAMESPACES} from './helpers';
import Observable from './store/observable';
import OmegaElement from './omega.element';

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
    const omegaElement = Renderer.renderOmegaElement(root, store);
    appendTo.append(
      omegaElement.element,
    );
  },

  renderOmegaElement(node, store) {
    if (!node || !node.tag) return null;

    const {
      tag,
      namespace,
      props,
      children,
    } = node;

    let data = tag && tag.data;
    if (typeof data === 'function') {
      data = data(props);
    }

    data = data
      ? Object.keys(data).reduce(
        (acc, key) => {
          acc[key] = data[key] instanceof Observable
            ? data[key]
            : store.child(data[key]);
          return acc;
        }, {})
      : {};

    if (typeof tag === 'function') {
      return Renderer.renderOmegaElement(tag({...props, children}, data), store);
    }

    return new OmegaElement(tag, namespace, props, data, children && flattenDeepArray(children), store);
  },

  createElement(src, namespace, store) {
    switch (typeof src) {
      case 'function':
        return Renderer.renderOmegaElement(src, store);
      case 'object':
        if (!(src instanceof Observable)) {
          if (!src.namespace) {
            src = {...src, namespace};
          }
          return Renderer.renderOmegaElement(src, store);
        }
        break;
      default:
        return document.createTextNode(src);
    }
  },
};


export default Renderer;