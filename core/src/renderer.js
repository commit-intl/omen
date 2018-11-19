import { DEHYDRATE, flattenDeepArray, NAMESPACES, REHYDRATE } from './helpers';
import OmenElement from './omen.element';
import DataNode from './store/data-node';
import Store from './store/store';

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
    return renderOmenElement(tag({ ...props, children }, state, data), store);
  }

  return new OmenElement(tag, namespace, props, data, children && flattenDeepArray(children), store);
};


const Renderer = {
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
            src = { ...src, namespace };
          }
          return renderOmenElement(src, store);
        }
        break;
      default:
        return document.createTextNode(src);
    }
  },

  render(appendTo, root, routingManager, storageBinding) {
    const init = () => {
      let promise;
      if (document.__omen__isServer) {
        promise = routingManager.getInitialState()
          .then(initialState => {
            const scriptInitialState = document.createElement('script');
            scriptInitialState.innerHTML = `document.__omen__initialState=${JSON.stringify(initialState)};`;
            document.head.appendChild(scriptInitialState);
            return new Store(initialState, storageBinding);
          });
      }
      else {
        let initialState = document.__omen__initialState;
        promise = new Promise(resolve => resolve(new Store(initialState, storageBinding)));
        if (!initialState) {
          promise
            .then(() => {routingManager.getInitialState()})
            .then(state => store.set(state))
            .catch(error => console.error('Failed to get initial state!', error));
        }
      }

      promise
        .then((store) => {
          const omenElement = renderOmenElement(root, store);
          if (omenElement.init(document.__omen__isServer ? DEHYDRATE : REHYDRATE, 'o')) {
            appendTo.append(
              omenElement.element,
            );
          }
          document.dispatchEvent(new Event('__omen__ready'));
        })
        .catch(error => console.error('Failed to initialize omen!', error));

      return promise;
    };

    if (!document.__omen__isServer) {
      document.addEventListener('DOMContentLoaded', init);
    }
    else {
      init();
    }
  }
};


export default Renderer;