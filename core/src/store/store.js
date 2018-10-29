import DataNode from './data-node';

const Store = (state, binding) => {
  const root = DataNode();
  const notify = root.notify;
  root.binding = binding;

  root.load = (value) => {
    if (root.binding) {
      let result = root.binding.load();
      if (result) {
        return root.set({
          ...value,
          ...result,
        });
      }
    }
    return root.set(value);
  };

  root.save = () => {
    if (root.binding) {
      root.binding.save(root.get());
    }
  };

  root.notify = (propagateUp = true, propagateDown = true) => {
    notify(propagateUp, propagateDown);
    root.save();
  };

  root.load(state);
  return root;
};

export default Store;
