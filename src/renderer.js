import BasicComponent from './basic.component';

export const Renderer = {
  create: (tag, props, ...children) => {
    if (!props) props = {};

    let create;

    if (typeof tag === 'function') {
      create = (tag, props, children) => {
        const component = tag({
          ...props,
          children,
        });

        if (component && typeof component.create === 'function') {
          return component.create();
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
    const root = typeof component === 'function' ? component().create() : component.create();
    root.init(store);
    appendTo.append(
      root.render()
    );
  }
};


export default {...Renderer};