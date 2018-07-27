import BasicComponent from './basic.component';

const hashCode = function (string) {
  var hash = 0;
  for (var i = 0; i < string.length; i++) {
    var character = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + character;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
};

export const Renderer = {
  createOld: (component, props, ...children) => {

    if (!props) props = {};

    let element;

    if (typeof component === 'function') {
      element = () => document.createDocumentFragment();
      return new BasicComponent(element, props, [() => component({ ...props, children: children })]);
    }
    else if (typeof component === 'object') {
      component.childrenFactories = children;
      return component.render(props);
    }
    else {
      element = () => document.createElement(component);
      return new BasicComponent(element, props, children.map(child => () => child));
    }
  },

  create: (tag, props, ...children) => {
    if (!props) props = {};

    let create;

    if (typeof tag === 'function') {
      create = (tag, props, children) => new BasicComponent(
        () => document.createDocumentFragment(),
        props,
        [
          {
            create: () => {
              const component = tag({
                ...props,
                children,
              });

              if (component && typeof component.create === 'function') {
                return component.create();
              }

              return component;
            }
          }
        ]
      );
    }
    else if (typeof tag === 'object') {
      console.error('omega.renderer.create', 'Component Type Object not yet Supported!');
      create = (tag, props, children) => tag;
    }
    else {
      create = (tag, props, children) => new BasicComponent(
        () => document.createElement(tag),
        props,
        children,
      );
    }

    return {
      create: () => create(tag, props, children),
    };
  },

  render: (component, appendTo, store) => {
    const root = component.create();
    root.init(store);
    appendTo.append(
      root.render()
    );
  }
};


export default { ...Renderer };