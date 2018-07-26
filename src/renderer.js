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

  create: (component, props, ...children) => {
    if (!props) props = {};

    let create;

    if (typeof component === 'function') {
      create = (component, props, children) => new BasicComponent(
        () => document.createDocumentFragment(),
        props,
        () => component({
          ...props,
          children: children
        })
      );
    }
    else if (typeof component === 'object') {
      console.error('omega.renderer.create', 'Component Type Object not yet Supported!')
      create = () => component;
    }
    else {
      create = () => new BasicComponent(
        () => document.createElement(component),
        props,
        children.map(child => () => child)
      );
    }

    return {
      create,
      component,
      props,
      children,
    }
  },

  render: (component, appendTo, store) => {
    //component.init(store);
    console.log(component);
    const pre = document.createElement('pre');
    const stringifyFunctions = (key, value) =>
      typeof value === 'function' ? 'function.' + (value + '').replace(/function (\S*)\((.|\n)*/, '$1') + '.' + hashCode(value + '') : value;
    pre.innerHTML = JSON.stringify(component, stringifyFunctions, 2);
    appendTo.append(
      pre
    );
  }
};


export default { ...Renderer };