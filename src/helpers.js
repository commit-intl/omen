export const cloneDeep = (value) => {
  if (typeof value !== 'object') {
    return value;
  }

  if (value.length !== undefined) {
    const clone = [];

    for (let i in value) {
      clone[i] = cloneDeep(value[i]);
    }

    return clone;
  }
  else {
    const clone = {};

    for (let i in value) {
      clone[i] = cloneDeep(value[i]);
    }

    return clone;
  }
};