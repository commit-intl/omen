import AbstractComponent from './abstract.component';
import { cloneDeep } from "./helpers";
import BasicComponent from './basic.component';

export class ControlComponent extends AbstractComponent {
  constructor(element, props, children) {
    super(element, props, children);
    console.log(this.props);
  }

  init(store) {
    super.init(store);

    if (this.props.bind != null) {
      this.bind(this.props.bind)
    }
    else if (this.props.forIn != null) {
      console.log('forIn');
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
          console.log('try bind', data, path(data));
          this.bind(path(data));
        });
      }
      else {
        this.removeAllListeners();
        this.onUpdate = [];

        let handler = (data) => {
          for (let i in this.children) {
            if(this.children[i].update) {
              this.children[i].update(data);
            }
          }
        };

        this.store.addListener(
          path,
          handler
        );
        console.log('addListener bind', path);

        this.listeners.push({ path, handler });

      }
    }
    console.log('after bind', path, this.onUpdate, this.props.id);
  }

  forIn(path) {
    if (this.store && path != null) {
      this.templateChildren = this.children;
      this.children = [];
      console.log('register forIn');

      let handler = (data) => {
        console.log('update forIn', data);
        const keys = Object.keys(data);
        let i;
        for (i = 0; i < keys.length; i++) {
          let key = keys[i];
          if (this.children[i * this.templateChildren.length]) {
            console.log('update existing', key, data[key]);
            for (let c = 0; c < this.templateChildren.length; c++) {
              this.children[(i * this.templateChildren.length) + c].update(key);
            }
          }
          else {
            console.log('create clone', key, data[key]);
            let cloned = this.templateChildren.map(child => child.clone ? child.clone() : child);
            this.children.push(...cloned);
            cloned.forEach(clone => {
              if(typeof clone === 'object') {
                clone.parent = this;
                console.log(clone);
                console.log('INIT');
                clone.init(this.store);
                console.log(clone);
                console.log('UPDATE');
                clone.update(key);
                console.log(clone);
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

  update(data) {
    console.log('update', data, this.onUpdate, this.props.id);
    this.currentData = data;

    for (let i in this.onUpdate) {
      console.log('update', i, this.onUpdate[i], data);
      this.onUpdate[i](data);
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