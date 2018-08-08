import BasicComponent from './basic.component';
import { flattenDeepArray } from './helpers';

export const Renderer = {
  create: (tag, props, ...children) => {
    if (!props) props = {};

    children = flattenDeepArray(children);

    let namespace;
    let create;

    if (typeof tag === 'function') {
      create = (tag, props, children, namespace) => {
        let component = tag({
          ...props,
          children,
        });

        while (component && typeof component.create === 'function') {
          component = component.create(namespace);
        }

        return component;
      };
    }
    else if (typeof tag === 'object') {
      console.error('omega.renderer.create', 'Component Type Object not yet Supported!');
      create = (tag, props, children, namespace) => tag;
    }
    else {
      if (tag === 'svg') {
        namespace = 'http://www.w3.org/2000/svg';
      }
      create = (tag, props, children, namespace) => new BasicComponent(
        namespace ? (namespace) => document.createElementNS(namespace, tag) : () => document.createElement(tag),
        props,
        children,
        namespace,
      );
    }

    if(children && children.length > 1) {
      children = children.map((child) => {
        if (typeof child === 'function') {
          return Renderer.create('span', {}, child);
        }
        return child;
      });
    }

    return {
      create: namespace
        ? () => create(tag, props, children, namespace)
        : (namespace) => create(tag, props, children, namespace),
      props,
    };
  },

  render: (component, appendTo, store) => {
    var root = component;
    while (root && typeof root.create === 'function') {
      root = root.create();
    }
    root = typeof root === 'function' ? root() : root;

    root.init(undefined, undefined, store);
    appendTo.append(
      root.render(),
    );
  },
};


export default { ...Renderer };