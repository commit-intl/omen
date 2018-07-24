import AbstractComponent from './abstract.component';
import { cloneDeep, htmlPropMap } from './helpers';


export class BasicComponent extends AbstractComponent {

  constructor(elementFactory, props, childrenFactories) {
    super(elementFactory, props, childrenFactories);

    if(props._for != null) {
      console.log(props._for, this.childrenFactories.length);
    }
  };

  init(store) {
    super.init(store);

    let newProps = {};
    for (let attr in this.props) {
      if (attr.indexOf('on') === 0) {
        const eventHandler = (handler) => (event) => handler(event, this.currentData, this.currentPath);
        this.listeners[attr.substr(2).toLowerCase()] = eventHandler(this.props[attr]);
      } else {
        newProps[attr] = this.props[attr];
      }
    }
    this.props = newProps;

    for (let i in this.listeners) {
      this.element.addEventListener(i, this.listeners[i]);
    }

    if (this.props._data != null) {
      this.dontPropagateUpdates = true;
      this.initChildren();
      this._data(this.props._data);
    }
    else if (this.props._bind != null) {
      this.dontPropagateUpdates = true;
      this.initChildren();
      this._bind(this.props._bind);
    }
    else if (this.props._for != null) {
      this.dontPropagateUpdates = true;
      this._for(this.props._for)
    }
    else {
      this.initChildren();
      this.updateProps(this.currentData);
    }
  }

  initChildren() {
    console.log(this.childrenFactories);
    this.children = this.childrenFactories && this.childrenFactories.map(f => typeof f === 'object' ? f.clone() : f());

    for (let i in this.children) {
      this.children[i].parent = this;
      if(this.children[i].init) {
        this.children[i].init(this.store);
      }
    }

    this.appendChildren();
  }

  appendChildren(from = 0, update = false) {
    for (let i = from; i < this.children.length; i++) {
      switch (typeof this.children[i]) {
        case 'string':
          this.element.append(this.children[i]);
          break;
        case 'function':
          let target = this.element;
          if (this.children.length !== 1) {
            target = document.createElement('span');
            this.element.appendChild(target);
          }
          this.onUpdate.push((data, path) => {
            target.innerHTML = this.children[i](data, path);
          });
          break;
        default:
          this.element.appendChild(this.children[i].element);
      }
    }
  }

  _data(data) {
    if (typeof data === 'function') {
      this.storeOnUpdate = (inputData, parentPath) => {
        let newData = data(inputData, parentPath);
        this.currentData = newData;
      };
    }
    else {
      this.currentData = data;
      this.dontAcceptData = true;
    }
  }

  _if(value) {
    let _if = this.props._if;
    const result = typeof _if === 'function' ? _if(value) : _if === value;

    if(result) {
      this.hide();
    }
    else {
      this.show();
    }

  }

  _bind(path) {
    if (this.store && path != null) {
      if (typeof path === 'function') {
        this.storeOnUpdate = (data, parentPath) => {
          let newPath = path(data, parentPath);
          if (this.currentPath !== newPath) {
            this._bind(newPath);
          }
        };
      }
      else {
        if (this.storeListener) {
          this.store.removeListener(this.storeListener.path, this.storeListener.handler);
          this.storeListener = null;
        }

        let handler = ((self, path) => (data) => {
          self.update(data, path, true);
        })(this, path);

        this.store.addListener(
          path,
          handler
        );

        this.storeListener = { path, handler };
      }
    }
  }

  _for(path) {
    console.log(this.childrenFactories.length);
    if (this.store && path != null) {
      if (typeof path === 'function') {
        this.storeOnUpdate = (data, parentPath) => {
          let newPath = path(data, parentPath);
          this._for(newPath);
        };
      }
      else {
        if (this.storeListener) {
          this.store.removeListener(this.storeListener.path, this.storeListener.handler);
          this.storeListener = null;
        }

        this.currentPath = path;

        let handler = (data) => {


          console.log('for', data, this.children, this.childrenFactories);
          const keys = data != null ? Object.keys(data) : [];
          let newChildren = [];
          let i;
          for (i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (this.children[i * this.childrenFactories.length]) {
              for (let c = 0; c < this.childrenFactories.length; c++) {
                this.children[(i * this.childrenFactories.length) + c].update(data[key], path ? path + '.' + key : key);
              }

              console.log('for update child', key);
            }
            else {
              console.log('for create child', key, this.childrenFactories.length);
              let cloned = this.childrenFactories.map(f => f => typeof f === 'object' ? f.clone() : f());
              this.children.push(...cloned);
              newChildren.push(...cloned);
              cloned.forEach(clone => {
                if (typeof clone === 'object') {
                  clone.parent = this;
                  clone.init(this.store);
                  clone.update(data[key], path ? path + '.' + key : key);
                }
              });
            }
          }

          let c = keys.length * this.childrenFactories.length;
          let children = [...this.children];
          while (c < children.length) {
            if (children[c].destroy) {
              children[c].destroy();
            }
            c++;
          }
          this.children = this.children.slice(0, keys.length * this.childrenFactories.length);

          if (newChildren.length > 0) {
            this.appendChildren(this.children.length - newChildren.length, true);
          }
        };


        this.store.addListener(
          path,
          handler,
          { depth: 1 }
        );

        this.storeListener = { path, handler };
      }
    }
  }

  render() {
    return this.element;
  }

  update(data, path, selfCall = false) {
    if(!this.dontAcceptData) {
      this.updateProps(data, path);
      super.update(data, path);

      if (this.storeOnUpdate && !selfCall) {
        this.storeOnUpdate(data, path);
      }
    }

    if (this.props._if !== undefined) {
      this._if(this.currentData);
    }

    if (!this.dontPropagateUpdates || selfCall) {
      for (let i in this.children) {
        if (this.children[i].update) {
          this.children[i].update(this.currentData, path);
        }
      }
    }
  }

  updateProps(data, path) {
    for (let i in this.props) {
      let value = typeof this.props[i] === 'function' ? this.props[i](data, path) : this.props[i];
      if (htmlPropMap[i]) {
        value = htmlPropMap[i](this.props[i]);
      }
      this.element[i] = value;
    }
  }

  clone() {
    const clone = new BasicComponent(this.elementFactory, cloneDeep(this.initialProps), this.childrenFactories);
    console.log(this, clone);
    return clone;
  }

  destroy(root) {
    super.destroy(root);

    if (this.storeListener) {
      this.store.removeListener(this.storeListener.path, this.storeListener.handler);
      this.storeListener = null;
    }
  }
}

export default BasicComponent;