import Renderer from './renderer';
import {htmlPropSet, NAMESPACES, htmlPropMap, REHYDRATE, DEHYDRATE, HYDRATED} from './helpers';


function OmenElement(tag, namespace, props, data, children, store) {
  let subscriptions = [];
  let elementProps = {};
  let elementListeners = {};
  let elementChildren = [];

  const self = {
    __isOmenElement: 1,
    tag,
    props: props || {},
    data: data || {},
    children: children || [],
    store: store,
    init(mode, id) {
      let newElement = true;
      if (mode === REHYDRATE) {
        newElement = self.rehydrateElement(id);
        if (!newElement) {
          mode = HYDRATED;
        }
      } else {
        self.initElement();
      }

      if (mode === DEHYDRATE) {
        self.props['data-oid'] = id;
      }

      self.initProps(mode);
      self.initChildren(mode, id);
      return newElement;
    },

    rehydrateElement(id) {
      self.element = document.querySelector(`[data-oid="${id}"]`);

      if (self.element) {
        const nodes = self.element.childNodes;
        let i = 0;
        let childId = 0;
        let groupId = 0;
        for (let i = 0; i < nodes.length; i++) {
          let newId;
          if (nodes[i].nodeName === '#comment') {
            newId = parseInt(nodes[i].nodeValue.replace(/(\d+)(-\d+)?$/i, '$1'));
          } else if (nodes[i].nodeName !== '#text') {
            newId = nodes[i].getAttribute('data-oid');
          }

          let match = newId && newId.match(/(\d+)(?:-(\d+))?$/i);
          if (match) {
            groupId = parseInt(match[1]);
            childId = match[2] ? parseInt(match[2]) : 0;
          } else {
            childId++;
          }

          if (!elementChildren[groupId]) {
            elementChildren[groupId] = [];
          }

          elementChildren[groupId][childId] = nodes[i];
        }

        return false;
      } else {
        self.initElement();
        return true;
      }
    },

    initElement() {
      if (typeof tag === 'string') {
        self.element = namespace && namespace !== NAMESPACES.html
          ? document.createElementNS(namespace, tag)
          : document.createElement(tag);

        if (tag === 'a') {
          const originalOnclick = self.props.onClick;
          self.props.onClick = (event) => {
            let result = true;
            if (typeof originalOnclick === 'function') {
              result = originalOnclick(event);
            }

            if (result
              && (!event.currentTarget.target || event.currentTarget.target === '_self')
              && document.__omen.isInternalUrl(event.currentTarget.href)
            ) {
              document.__omen.navigate(event.currentTarget.href);
              result = false;
              event.preventDefault('');
            }
            return result;
          }
        }
      } else {
        console.error('Unknown jsx tag: ' + tag);
      }
    },

    initProps(mode) {
      for (let attr in self.props) {
        self.setAttribute(attr, self.props[attr], mode);
      }
    },

    setAttribute(key, value, mode) {
      if (value && value.__isDataNode) {
        subscriptions.push(
          value.subscribe((result) => self.setAttribute(key, result, mode), mode !== REHYDRATE),
        );
      } else if (key.startsWith('on')) {
        let event = key.substr(2).toLowerCase();
        if (elementListeners[event]) {
          self.element.removeEventListener(self.listeners[event]);
        }

        self.element.addEventListener(event, value);
      } else {
        if (htmlPropMap[key]) {
          value = htmlPropMap[key](value);
        }

        if (elementProps[key] !== value) {
          if (mode !== DEHYDRATE && htmlPropSet.indexOf(key) >= 0) {
            if (mode === REHYDRATE) {
              self.element.setAttribute(key, undefined);
            }
            self.element[key] = value;
          } else if (key === 'className') {
            if (self.element.namespaceURI !== NAMESPACES.html) {
              self.element.setAttribute('class', value);
            } else {
              self.element[key] = value;
            }
          } else {
            self.element.setAttribute(key, value);
          }
        }

        elementProps[key] = value;
      }
    },

    get(key, value) {
      return elementProps[key];
    },

    initChildren(mode, id) {
      const createChild = (child, childId) => {
        let element = Renderer.createElement(child, namespace, self.store);
        if (element) {
          if (element.init) {
            element.init(mode, `${id}.${childId}`);
          } else if (mode === DEHYDRATE && element.nodeName === '#text') {
            element = [
              document.createComment(`${id}.${childId}`),
              element,
            ];
          }
        }
        return element;
      };

      const setChild = (pos, children) => {
        if (!Array.isArray(children)) {
          children = [children];
        }

        self.setChild(pos, ...children);
      };

      self.children.forEach(
        (child, index) => {
          if (!child) return;

          if (child.__isDataNode) {
            const map = {};
            subscriptions.push(
              child.subscribe((result) => {
                if (!result) return;
                if (Array.isArray(result)) {
                  setChild(
                    index,
                    result.map((child, childIndex) => {
                      const elementKey = JSON.stringify(child);
                      let element = map[elementKey];
                      if (!element) {
                        element = createChild(child, `${index}-${childIndex}`);
                        map[elementKey] = element;
                      }
                      return element;
                    }),
                  );
                } else {
                  let element = createChild(result, index);
                  setChild(index, element);
                }
              }, true),
            );
          } else {
            let element = createChild(child, index);
            setChild(index, element);
          }
        },
      )
    },

    setChild(pos, ...children) {
      const filteredChildren = children.filter((child) => child != null);

      const getNode = (child) => (child && child.__isOmenElement) ? child.element : child;

      let prevIndex = 0;
      for (let i = 0; i < elementChildren.length && i < pos; i++) {
        prevIndex += elementChildren[i] ? elementChildren[i].length : 0;
      }

      let group = elementChildren[pos] || [];

      if (self.element.childNodes !== undefined) {
        let i = 0;
        while (i < group.length) {
          const currentNode = self.element.childNodes[prevIndex + i];
          const newNode = getNode(filteredChildren[i]);
          if (i < filteredChildren.length) {
            if (currentNode) {
              if (!currentNode.isSameNode(newNode)) {
                self.element.replaceChild(newNode, currentNode);
                if (group[i] && group[i].destroy) {
                  group[i].destroy();
                }
                group[i] = filteredChildren[i];
              }
            } else {
              self.element.insertBefore(newNode, null);
            }
          } else if (currentNode) {
            self.element.removeChild(currentNode);
            if (group[i] && group[i].destroy) {
              group[i].destroy();
            }
            group[i] = undefined;
          }
          i++;
        }

        const insertBeforeIndex = prevIndex + group.length;
        const insertBefore = self.element.childNodes[insertBeforeIndex];

        while (i < filteredChildren.length) {
          const newNode = getNode(filteredChildren[i]);
          if (newNode) {
            self.element.insertBefore(newNode, insertBefore);
            group[i] = filteredChildren[i];
          }
          i++;
        }

        elementChildren[pos] = group.filter(g => g);
      }
    },

    appendChild(...children) {
      self.setChild(elementChildren.length, ...children);
    },

    destroy() {
      if (subscriptions) {
        subscriptions.forEach(sub => sub());
      }
      subscriptions = [];

      if (elementChildren) {
        elementChildren.forEach(
          group => group && group.forEach(
            child => child && child.destroy && child.destroy(),
          ),
        );
      }

      elementChildren = [];
    },
  };

  return self;
}

export default OmenElement;
