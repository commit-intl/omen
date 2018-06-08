import BasicComponent from './basic.component';
import ControlComponent from './control.component';

export const Renderer = {
  create: (component, props, ...children) => {

    if (!props) props = {};

    let element;

    if (typeof component === 'function') {
      props.children = children;
      return component(props);
    }
    else if (typeof component === 'object') {
      props.children = children;
      return component.render(props);
    }
    else if (component === '_o') {
      element = () => document.createDocumentFragment();
      return new ControlComponent(element, props, children);
    }
    else {
      element = () => document.createElement(component);
      return new BasicComponent(element, props, children);
    }
  },

  render: (component, store) => {
    component.init(store);
    document.body.appendChild(
      component && component.render()
    );
  }
};


export default { ...Renderer };