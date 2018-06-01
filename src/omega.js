import Component from './component';

const omega = {
  create: (component, props, ...children) => {

    if(!props) props = {};

    switch (typeof component) {
      case 'function':
        props.children = children;
        return component(props);
      case 'object':
        props.children = children;
        return component.render(props);
      case 'string':
        component = document.createElement(component);
        break;
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
          component.append(children[i]);
          break;
        case 'function':
          let fragment = document.createElement('span');
          onRender.push((data) => {
            console.log('jep', data);
            fragment.innerHTML = children[i](data)
          });
          component.appendChild(fragment);
          break;
        default:
          console.log(children[i]);
          childrenElements.push(children[i]);
          component.appendChild(children[i].element);
      }
    }


    return new Component(component, listeners, childrenElements, elementProps, directives, onRender);
  },

  render: (component, store) => {
    document.body.appendChild(
      component && component.render()
    );
    component.init(store);
  }
};

module.exports = omega;