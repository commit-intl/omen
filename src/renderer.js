import BasicComponent from './basic.component';

export const Renderer = {
  create: (component, props, ...children) => {

    if (!props) props = {};

    let element;

    if (typeof component === 'function') {
      element = () => document.createDocumentFragment();
      console.log(props);
      return new BasicComponent(element, props, [() => component({...props, children: children})]);
    }
    else if (typeof component === 'object') {
      props.children = children;
      return component.render(props);
    }
    else {
      element = () => document.createElement(component);
      if(props._for != null) {
        console.log(props._for, children.length);
      }
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