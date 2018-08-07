import AbstractDirective from './abstract.directive';

export default class ForDirective extends AbstractDirective {

  constructor(component, value) {
    super(component, value);
    this.storeBinding = undefined;
    this.boundPath = undefined;
    this.combiner = undefined;
  }


  init() {
    if (typeof this.value === 'function' || (this.value && this.value[0] === '.')) {
      this.combiner =
        typeof this.value === 'function'
          ? (data, path) => this.value(data, path)
          : (data, path) => path != null && path + this.value;
    }
    else {
      this.combiner = () => this.value;
    }

    this.update(this.component.currentData, this.component.currentPath);
  }

  update(data, path) {
    let newPath = this.combiner(data, path);
    if (this.boundPath !== newPath) {
      this.for(newPath);
    }

    this.component.updateProps(data,path);
  }

  destroy() {
    if(this.storeBinding) {
      this.component.store.removeListener(this.storeBinding.path, this.storeBinding.handler);
    }
  }

  for(path) {
    console.log('for', path, this.component.store);
    if (this.component.store) {
      if (this.storeBinding) {
        this.component.store.removeListener(this.storeBinding.path, this.storeBinding.handler);
        this.storeBinding = null;
      }

      this.boundPath = path;

      const handler = (data) => this.forHandler(data, this.boundPath);

      this.component.store.addListener(
        path,
        handler,
        { depth: 1 },
      );

      this.storeBinding = {
        path,
        handler,
      };
    }
  }

  forHandler(data, path) {
    const keys = data != null && typeof data === 'object' ? Object.keys(data) : [];
    let i;
    for (i = 0; i < keys.length; i++) {
      let key = keys[i];
      let subPath = path ? path + '.' + key : key;
      if (this.component.children[i * this.component.childrenFactories.length]) {
        for (let c = 0; c < this.component.childrenFactories.length; c++) {
          this.component.updateChild(
            this.component.children[(i * this.component.childrenFactories.length) + c],
            data[key],
            subPath,
          );
        }
      }
      else {
        let cloned = this.component.createNewChildren();
        const from = this.component.children.length;
        this.component.children.push(...cloned);

        cloned.forEach(clone => {
          if (typeof clone === 'object') {
            clone.parent = this.component;
            clone.init(data[key], subPath, this.component.store);
          }
        });

        this.component.appendChildren(from);
      }
    }

    let c = keys.length * this.component.childrenFactories.length;
    let childrenCopy = [...this.component.children];
    while (c < childrenCopy.length) {
      if (childrenCopy[c].destroy) {
        childrenCopy[c].destroy();
      }
      c++;
    }
    this.component.children = this.component.children.slice(0, keys.length * this.component.childrenFactories.length);
  }
}