import Pointer from './store/Pointer';
import Renderer from './renderer';
import {ElementProxy} from './element.proxy';
import {NAMESPACES} from './helpers';


export class OmegaElement {

  constructor(tag, namespace, props, data, children, store) {
    this.tag = tag;
    this.namespace = namespace;
    this.props = props || {};
    this.data = data || {};
    this.children = children;
    this.store = store;

    this.initElement();
    this.initProps();
    this.initChildren();
  }

  initElement() {
    if(typeof this.tag === 'string') {
      this.element = new ElementProxy(
        this.namespace && this.namespace !== NAMESPACES.html
          ? document.createElementNS(this.namespace, this.tag)
          : document.createElement(this.tag),
      );
    }
    else {
       console.error('Unknown jsx tag: ' + this.tag);
    }
  }

  initProps() {
    for (let attr in this.props) {
      this.element.set(attr, this.props[attr]);
    }
  }

  initChildren() {
    const setChild = (pos, children) => {
      if(!Array.isArray(children)) {
        children = [children];
      }

      children = children.map((child) => {
        if (child instanceof OmegaElement) {
          return child.getElement();
        }
        return child;
      });

      this.element.setChild(pos, ...children);
    };

    this.children.forEach(
      (child, index) => {
        let childElement = Renderer.createElement(child, this.namespace, this.store);
        if (!childElement && child && child instanceof Pointer) {
          child.subscribe((result) => {
            console.log('renderer', result);
            if (Array.isArray(result)) {
              setChild(
                index,
                result.map(
                  child => Renderer.createElement(child, this.namespace, this.store),
                ),
                result.map(
                  child => child.key,
                ),
              );
            }
            else {
              setChild(index, Renderer.createElement(result, this.namespace, this.store));
            }
          }, true);
        }
        else {
          setChild(index, childElement);
        }
      },
    )
  }

  getElement() {
    return this.element && this.element.element;
  }
}