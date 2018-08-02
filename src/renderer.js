import BasicComponent from './basic.component';

export const Renderer = {
  create: (tag, props, ...children) => {
    if (!props) props = {};

    let create;

    if (typeof tag === 'function') {
      create = (tag, props, children) => {
        var component = tag({
          ...props,
          children,
        });

        while (component && typeof component.create === 'function') {
          component = component.create();
        }

        return component;
      };
    }
    else if (typeof tag === 'object') {
      console.error('omega.renderer.create', 'Component Type Object not yet Supported!');
      create = (tag, props, children) => tag;
    }
    else {
      create = (tag, props, children) => new BasicComponent(
        tag === 'svg'
          ? () => document.createElementNS('http://www.w3.org/2000/svg')
          : () => document.createElement(tag),
        props,
        children,
      );
    }

    return {
      create: () => create(tag, props, children),
    };
  },

  render: (component, appendTo, store) => {
    var root = component;
    while (root && typeof root.create === 'function') {
      root = root.create();
    }
    root = typeof root === 'function' ? root() : root;

    root.init(store);
    appendTo.append(
      root.render(),
    );
  },
};


export default {...Renderer};