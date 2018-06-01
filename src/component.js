const mapping = {
  'style': (value) => {
    let result = '';
    for (let i in value) {
      result += i.replace(/([A-Z])/g, '-$1').toLowerCase() + ':' + value[i] + ';';
    }
    return result;
  }
};

const directives = {
  '$bind': (path, store, component) => {
    let handler = (data) => {
      if(data !== undefined) {
        console.log('update', data);
        component.update(data);
      }
      else {
        store.removeListener(path, handler);
        component.destroy();
      }
    };

    store.addListener(
      path,
      handler
    );
  }
};

const Component = function (element, listeners, children, props, directives, onUpdate) {
  this.parent = undefined;
  this.element = element;
  this.listeners = listeners;
  this.children = children;
  this.props = props;
  this.directives = directives;
  this.onUpdate = onUpdate;

  for ( let i in children ) {
    children[i].parent = this;
  }
};

Component.prototype = {
  removeChild(child) {
    this.children = this.children.filter(c => c !== child);
  },

  render() {
    this.update();
    return this.element;
  },

  update(data) {
    let props = {};
    for (let i in this.props) {
      props[i] = typeof this.props[i] === 'function' ? this.props[i](data) : this.props[i];
      if (mapping[i]) {
        props[i] = mapping[i](props[i]);
      }
      this.element[i] = props[i];
    }

    console.log('update', props);

    for (let i in this.onUpdate) {
      this.onUpdate[i](data);
    }

    for (let i in this.children) {
      this.children[i].update(data);
    }
  },

  init(store) {
    for (let i in this.listeners) {
      this.element.addEventListener(i, this.listeners[i]);
    }

    for (let i in this.directives) {
      directives[i](this.directives[i], store, this);
    }

    console.log(this.element, this.listeners);

    for (let i in this.children) {
      this.children[i].init(store);
    }
  },

  destroy() {
    this.parent.removeChild(this);
    this.element.parentNode.removeChild(this.element);
  }
};

module.exports = Component;