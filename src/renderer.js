import BasicComponent from './basic.component';

export const Renderer = {
  create: (component, props, ...children) => {

    if (!props) props = {};

    let element;

    if (typeof component === 'function') {
      element = () => document.createDocumentFragment();
      console.warn('function', children);
      return new BasicComponent(element, props, [() => component({...props, children: children})]);
    }
    else if (typeof component === 'object') {
      console.warn('object', component, children);
      component.childrenFactories = children;
      return component.render(props);
    }
    else {
      element = () => document.createElement(component);
      console.warn('element', component, children);
      return new BasicComponent(element, props, children.map(child => () => child));
    }
  },

  render: (component, appendTo, store) => {
    component.init(store);
    appendTo.appendChild(
      component && component.render()
    );
  }
};


export default { ...Renderer };