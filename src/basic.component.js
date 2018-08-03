import AbstractComponent from './abstract.component';
import { cloneDeep, directivePropMap, htmlPropMap } from './helpers';

export class BasicComponent extends AbstractComponent {

  constructor(elementFactory, props, childrenFactories, namespace) {
    super(elementFactory, props, childrenFactories, namespace);
    this.boundPath = undefined;
    this.propagateUpdates = true;
    this.currentProps = {};
    this.directives = [];
  };

  init(store) {
    super.init(store);

    let newProps = {};
    for (let attr in this.props) {
      if (attr.indexOf('on') === 0) {
        const eventHandler = (handler) => (event) => handler(event, this.currentData, this.currentPath);
        this.listeners[attr.substr(2).toLowerCase()] = eventHandler(this.props[attr]);
      } else if (attr[0] === '_' && directivePropMap[attr]) {
        this.directives.push(new directivePropMap[attr](this));
      } else {
        newProps[attr] = this.props[attr];
      }
    }
    this.props = newProps;

    for (let i in this.listeners) {
      this.element.addEventListener(i, this.listeners[i]);
    }

    if (this.props._if !== undefined) {
      this._if(this.currentData);
    }

    if (this.props._data != null) {
      this.propagateUpdates = false;
      this.initChildren();
      this._data(this.props._data);
    }
    else if (this.props._bind != null) {
      this.propagateUpdates = false;
      this.initChildren();
      this._bind(this.props._bind);
    }
    else if (this.props._for != null) {
      this.propagateUpdates = false;
      this._for(this.props._for)
    }
    else {
      this.initChildren();
      this.updateProps(this.currentData);
    }
  }

  _data(data) {
    if (typeof data === 'function') {
      this.storeOnUpdate = (inputData, parentPath) => {
        this.currentData = data(inputData, parentPath);
      };
    }
    else {
      this.currentData = data;
      this.dontAcceptData = true;
    }
  }

  _if(data, path) {
    let _if = this.props._if;
    const result = typeof _if === 'function' ? _if(data, path) : _if === data;

    if (result) {
      this.show();
    }
    else {
      this.hide();
    }
  }

  _switch(data, path) {
    let _switch = this.props._switch;
    const result =
      typeof _switch === 'function' ?
        _switch(data, path)
        : (_switch === true ? data : _switch);

    this.children.forEach(
      child => child
        && child._case
        && child._case(result),
    );
  }

  _case(value) {
    let _case = this.props._case;
    if (_case !== undefined) {
      const result = typeof _case === 'function' ? _case(value) : _case === value;

      if (result) {
        this.show();
      }
      else {
        this.hide();
      }
    }
  }

  _bind(_bind) {
    if (this.store && _bind != null) {
      if (typeof _bind === 'function' || _bind[0] === '.') {
        const combiner =
          typeof _bind === 'function'
            ? (data, path) => _bind(data, path)
            : (data, path) => path + _bind;
        this.storeOnUpdate = (data, path) => {
          let newPath = combiner(data, path);
          if (this.boundPath !== newPath) {
            this._bind(newPath);
          }
        };
      }
      else {
        if (this.storeBinding) {
          this.store.removeListener(this.storeBinding.path, this.storeBinding.handler);
          this.storeBinding = null;
        }

        this.boundPath = _bind;

        let handler = ((self, path) => (data) => {
          self.update(data, path, true);
        })(this, _bind);

        this.store.addListener(
          _bind,
          handler,
        );

        this.storeBinding = {path: _bind, handler};
      }
    }
  }

  _for(_for) {
    if (this.store && _for != null) {
      if (typeof _for === 'function' || _for[0] === '.') {
        const combiner = (function (binding) {
          if (typeof binding === 'function') {
            return (data, path) => binding(data, path)
          }
          else {
            return (data, path) => path + _for;
          }
        })(_for);

        this.storeOnUpdate = (data, path) => {
          let newPath = combiner(data, path);
          if (this.boundPath !== newPath) {
            this._for(newPath);
          }
        };
      }
      else {
        if (this.storeBinding && this.storeBinding.subscription) {
          this.store.removeListener(this.storeBinding.subscription.path, this.storeBinding.subscription.handler);
          this.storeBinding = null;
        }

        this.boundPath = _for;

        let handler = (data) => {
          const keys = data != null && typeof data === 'object' ? Object.keys(data) : [];
          let i;
          for (i = 0; i < keys.length; i++) {
            let key = keys[i];
            let subPath = _for ? _for + '.' + key : key;
            if (this.children[i * this.childrenFactories.length]) {
              for (let c = 0; c < this.childrenFactories.length; c++) {
                this.updateChild(
                  this.children[(i * this.childrenFactories.length) + c],
                  data[key],
                  subPath,
                );
              }
            }
            else {
              let cloned = this.createNewChildren();
              const from = this.children.length;
              this.children.push(...cloned);

              cloned.forEach(clone => {
                if (typeof clone === 'object') {
                  clone.parent = this;
                  clone.init(this.store);
                }

                this.updateChild(
                  clone,
                  data[key],
                  subPath,
                );
              });

              this.appendChildren(from);
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

        };


        this.store.addListener(
          _for,
          handler,
          {depth: 1},
        );

        this.storeBinding = {
          update: this._for
          subscription: {
            path: _for, handler
          }
        };
      };
    }
  }

  render() {
    return this.element;
  }

  update(data, path, selfCall = false) {
    if (!this.storeBinding) {
      super.update(data, path);
      this.updateProps(data, path);

      if (this.storeOnUpdate && !selfCall) {
        this.storeOnUpdate(data, path);
      }

      if (this.props._if !== undefined && !selfCall) {
        this._if(data, path);
      }
    }
    this.updateChildren(selfCall)
  }

  updateChildren(selfCall) {
    if (this.propagateUpdates || selfCall) {
      for (let i in this.children) {
        this.updateChild(this.children[i], data, path);
      }
    }
  }

  updateProps(data, path) {
    for (let i in this.props) {
      let value = typeof this.props[i] === 'function' ? this.props[i](data, path) : this.props[i];
      if (htmlPropMap[i]) {
        value = htmlPropMap[i](this.props[i]);
      }

      if (this.currentProps[i] !== value) {
        if (i === 'style') {
          this.element[i] = value;
        }
        else if (i === 'className') {
          if (this.namespace) {
            this.element.setAttribute('class', value);
          }
          else {
            this.element[i] = value;
          }
        }
        else {
          this.element.setAttribute(i, value);
        }
      }
      this.currentProps[i] = value;
    }
  }

  updateChild(child, data, path) {
    switch (typeof child) {
      case 'object':
        child.update(data, path);
        break;
      case 'function':
        child(data, path);
        break;
    }
  }

  clone() {
    return new BasicComponent(this.elementFactory, cloneDeep(this.initialProps), this.childrenFactories);
  }

  destroy(root) {
    super.destroy(root);

    if (this.storeBinding) {
      this.store.removeListener(this.storeBinding.path, this.storeBinding.handler);
      this.storeBinding = null;
    }
  }
}

export default BasicComponent;