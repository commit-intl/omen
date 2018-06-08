import AbstractComponent from './abstract.component';
import { cloneDeep } from "./helpers";
import BasicComponent from './basic.component';

export class ControlComponent extends AbstractComponent {
  constructor(element, props, children) {
    super(element, props, children);
  }

  init(store) {
    super.init(store);

    if (this.props.bind != null) {
      this.bind(this.props.bind)
    }
    else if (this.props.forIn != null) {
      this.forIn(this.props.forIn)
    }

    for (let i in this.children) {
      switch (typeof this.children[i]) {
        case 'string':
          this.element.append(this.children[i]);
          break;
        case 'function':
          let span = document.createElement('span');
          this.onUpdate.push((data) => {
            span.innerHTML = this.children[i](data)
          });
          this.element.appendChild(span);
          break;
        default:
          this.element.appendChild(this.children[i].element);
      }
    }
  }

  bind(path) {
    if (this.store && path != null) {
      if (typeof path === 'function') {
        this.onUpdate.push((data) => {
          this.bind(path(data));
        });
      }
      else {
        this.removeAllListeners();
        this.onUpdate = [];

        let handler = (data) => {
          for (let i in this.children) {
            if(this.children[i].update) {
              this.children[i].update(data, path);
            }
          }
        };

        this.store.addListener(
          path,
          handler
        );
        this.listeners.push({ path, handler });
      }
    }
  }

  forIn(path) {
    if (this.store && path != null) {
      this.templateChildren = this.children;
      this.children = [];

      let handler = (data) => {
        const keys = Object.keys(data);
        let i;
        for (i = 0; i < keys.length; i++) {
          let key = keys[i];
          if (this.children[i * this.templateChildren.length]) {
            for (let c = 0; c < this.templateChildren.length; c++) {
              this.children[(i * this.templateChildren.length) + c].update(key, path);
            }
          }
          else {
            let cloned = this.templateChildren.map(child => child.clone ? child.clone() : child);
            this.children.push(...cloned);
            cloned.forEach(clone => {
              if(typeof clone === 'object') {
                clone.parent = this;
                clone.init(this.store);
                clone.update(key, path);
              }
            });
          }
        }
      };

      this.store.addListener(
        path,
        handler
      );

      this.listeners.push({ path, handler });
    }
  }

  destroy() {
    this.removeAllListeners();
    super.destroy();
  }

  removeAllListeners() {
    for (let i in this.listeners) {
      this.store.removeListener(this.listeners[i].path, this.listeners[i].handler);
    }
    this.listeners = [];
  }

  clone() {
    let clonedChildren = this.children.map(child => child.clone ? child.clone() : child);
    return new ControlComponent(this.elementFactory, cloneDeep(this.initialProps), clonedChildren);
  }
}

export default ControlComponent;