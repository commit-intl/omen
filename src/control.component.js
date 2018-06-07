import AbstractComponent from './abstract.component';

export class ControlComponent extends AbstractComponent {
  constructor(element, props, children) {
    super(element, props, children);

    this.listeners = [];
  }

  init(store) {
    super.init(store);

    if(this.props.bind) {
      this.bind(this.props.bind)
    }
  }

  bind(path) {
    if(this.store && path) {
      let handler = (data) => {
        if(data !== undefined) {
          console.log('update', data);
          this.update(data);
        }
      };

      this.store.addListener(
        path,
        handler
      );

      this.listeners.push({path, handler});
    }
  }

  destroy() {
    for(let i in this.listeners) {
      this.store.removeListener(this.listeners[i].path, this.listeners[i].handler);
    }
    this.listeners = [];
    super.destroy();
  }
}

export default ControlComponent;