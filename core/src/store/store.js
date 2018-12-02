import DataNode from './data-node';

const Store = (state) => {
  const root = DataNode();
  const notify = root.notify;


  root.save = () => {
    if (root.binding) {
      root.binding.save(root.get());
    }
  };

  root.notify = (propagateUp = true, propagateDown = true) => {
    notify(propagateUp, propagateDown);
    root.save();
  };

  root.set(state);
  return root;
};

export default Store;
