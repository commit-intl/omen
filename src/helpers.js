export const cloneDeep = (value) => {
  if (typeof value !== 'object') {
    return value;
  }

  if(value instanceof Date) {
    return new Date(value.valueOf())
  }

  if (value.length !== undefined) {
    const clone = [];

    for (let i in value) {
      clone[i] = cloneDeep(value[i]);
    }

    return clone;
  }

  const clone = {};

  for (let i in value) {
    clone[i] = cloneDeep(value[i]);
  }

  return clone;
};


export const htmlPropMap = {
  'style': (value) => {
    let result = '';
    for (let i in value) {
      result += i.replace(/([A-Z])/g, '-$1').toLowerCase() + ':' + value[i] + ';';
    }
    return result;
  }
};