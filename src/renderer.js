import BasicComponent from './basic.component';

export const Renderer = {
  create: (component, props, ...children) => {

    if (!props) props = {};

    let element;

    if (typeof component === 'function') {
      element = () => document.createDocumentFragment();
      return new BasicComponent(element, props, [component({...props, children: children})]);
    }
    else if (typeof component === 'object') {
      props.children = children;
      return component.render(props);
    }
    else {
      element = () => document.createElement(component);
      return new BasicComponent(element, props, children);
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