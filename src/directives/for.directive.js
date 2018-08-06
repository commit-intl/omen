import AbstractDirective from './abstract.directive';

const hashCode = function (string) {
  var hash = 0;
  for (var i = 0; i < string.length; i++) {
    var character = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + character;
    hash = hash & hash; // Convert to 32bit integer
  }

  hash &= 0x7FFFFFFF;

  return hash.toString(36);
};

export default class ForDirective extends AbstractDirective {

  constructor(component, value) {
    super(component, value);
    this.storeBinding = undefined;
    this.boundPath = undefined;
    this.combiner = undefined;
    this.id = hashCode(Date.now()+''+this.value);
  }


  init() {
    console.log('for init', this.id, this.value);
    if (typeof this.value === 'function' || (this.value && this.value[0] === '.')) {
      this.combiner =
        typeof this.value === 'function'
          ? (data, path) => this.value(data, path)
          : (data, path) => path && path + this.value;
    }
    else {
      this.combiner = () => this.value;
    }

    this.update(this.component.currentData, this.component.currentPath);
  }

  destroy() {
  }

  update(data, path) {
    let newPath = this.combiner(data, path);
    if (this.boundPath !== newPath) {
      this.for(newPath);
    }
  }


  for(path) {
    if(this.component.store) {
      if (this.storeBinding && this.storeBinding.subscription) {
        this.component.store.removeListener(this.storeBinding.subscription.path, this.storeBinding.subscription.handler);
        this.storeBinding = null;
      }

      this.boundPath = path;

      const handler = (data) => this.forHandler(data, this.boundPath);

      console.log('for listen', this.id, path);
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
          console.log('update child', key, data[key]);
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
            clone.parent = this;
            clone.init(data[key],subPath,this.store);
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