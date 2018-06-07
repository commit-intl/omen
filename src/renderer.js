import BasicComponent from './basic.component';
import ControlComponent from './control.component';

export const Renderer = {
  create: (component, props, ...children) => {

    if (!props) props = {};

    let element;

    console.log(component);

    if (typeof component === 'function') {
      props.children = children;
      return component(props);
    }
    else if (typeof component === 'object') {
      props.children = children;
      console.log('object', component, props);
      return component.render(props);
    }
    else {
      if (component === '_o') {
        element = document.createDocumentFragment();
      }
      else {
        element = document.createElement(component);
      }


      let listeners = [];
      let elementProps = {};
      let onRender = [];
      let directives = {};
      let childrenElements = [];

      for (let attr in props) {
        if (attr.indexOf('on') === 0) {
          listeners[attr.substr(2).toLowerCase()] = props[attr];
        } else if (attr[0] === '$') {
          directives[attr] = props[attr];
        } else {
          elementProps[attr] = props[attr];
        }
      }

      for (let i in children) {
        switch (typeof children[i]) {
          case 'string':
            element.append(children[i]);
            break;
          case 'function':
            let fragment = document.createElement('span');
            onRender.push((data) => {
              console.log('jep', data);
              fragment.innerHTML = children[i](data)
            });
            element.appendChild(fragment);
            break;
          default:
            console.log(children[i]);
            childrenElements.push(children[i]);
            element.appendChild(children[i].element);
        }
      }


      if (component === '_o') {
        return new ControlComponent(element, elementProps, childrenElements);
      }
      else {
        return new BasicComponent(element, elementProps, childrenElements, listeners, onRender);
      }
    }
  },

  render: (component, store) => {
    document.body.appendChild(
      component && component.render()
    );
    component.init(store);
  }
};


export default { ...Renderer };