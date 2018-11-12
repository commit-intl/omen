import {flattenDeepArray, NAMESPACES} from './helpers';
import OmenElement from './omen.element';
import DataNode from './store/data-node';

const renderOmenElement = (node, store) => {
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
        acc[key] = store.child(data[key]);
        return acc;
      }, {})
    : {};

  let state = tag && tag.initialState;
  if (typeof state === 'function') {
    state = state(props);
  }

  if (state != null) {
    let initialState = state;
    state = DataNode();
    state.set(initialState);
  }

  if (typeof tag === 'function') {
    return renderOmenElement(tag({...props, children}, state, data), store);
  }

  return new OmenElement(tag, namespace, props, data, children && flattenDeepArray(children), store);
};


export const Renderer = {
  create(tag, props, ...children) {
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

  render(root, appendTo, store, options) {
    const omenElement = renderOmenElement(root, store);
    omenElement.init(options && options.mode, '');
    appendTo.append(
      omenElement.element,
    );
  },

  renderToString(root, store) {
    const omegaElement = renderOmegaElement(root, store);
    return omegaElement.element.outerHTML;
  },

  createElement(src, namespace, store) {
    switch (typeof src) {
      case 'function':
        return renderOmenElement(src, store);
      case 'object':
        if (!src.__isDataNode) {
          if (!src.namespace) {
            src = {...src, namespace};
          }
          return renderOmenElement(src, store);
        }
        break;
      default:
        return document.createTextNode(src);
    }
  },
};


export default Renderer;