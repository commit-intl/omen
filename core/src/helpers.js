export const cloneDeep = (value) => {
  if (typeof value !== 'object') {
    return value;
  }

  if (value instanceof Date) {
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

export const flattenDeepArray = (array) => {
  let result = [];

  for (let i = 0; i < array.length; i++) {
    if (array[i] && array[i].constructor === Array) {
      result.push(...flattenDeepArray(array[i]));
    }
    else {
      result.push(array[i]);
    }
  }

  return result;
};

/**
 * concatenates and de-duplicates the arrays
 */
export const mergeArrays = (arrayA, arrayB) => {
  let result = arrayA.concat(arrayB);
  return result.filter((key, index) => result.indexOf(key) === index);
};


export const NAMESPACES = {
  html: 'http://www.w3.org/1999/xhtml',
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML',
};

export const htmlPropSet = [
  'styles',
  'value',
  'textContent',
  'innerHTML',
];

export const htmlPropMap = {
  'style': (value) => {
    let result = '';
    for (let i in value) {
      result += i.replace(/([A-Z])/g, '-$1').toLowerCase() + ':' + value[i] + ';';
    }
    return result;
  },
  'className': (names) => {
    if (typeof names === 'object') {
      if (Array.isArray(names)) {
        return names.filter(x => !!x).join(' ');
      } else {
        return Object.keys(names).filter(key => !!names[key]).join(' ');
      }
    }
    return names;
  }
};

export const isNode = (o) =>
  typeof Node === "object"
    ? o instanceof Node
    : o && typeof o === "object"
    && typeof o.nodeType === "number"
    && typeof o.nodeName === "string";