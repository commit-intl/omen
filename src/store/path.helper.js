export const getChild = (obj, path) => {
  if (path) {
    if (typeof path === 'string') {
      path = path.split('.')
    }
    let subObject = obj;
    for (let i in path) {
      if (!subObject) {
        return subObject;
      }
      subObject = subObject[path[i]];
    }
    return subObject;
  }
  return path === '' ? obj : undefined;
};

export const mergePath = (root, child) => {
  if (Array.isArray(root)) {
    if (Array.isArray(child)) {
      return [...root, ...child];
    }
    else {
      return [...root, ...(child + '').split('.')];
    }
  }
  else {
    if (Array.isArray(child)) {
      return root + '.' + child.join('.');
    }
    else {
      return root + '.' + child;
    }
  }
};