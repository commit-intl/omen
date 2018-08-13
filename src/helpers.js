import SwitchDirective from './directives/switch.directive';
import DataDirective from './directives/data.directive';
import BindDirective from './directives/bind.directive';
import IfDirective from './directives/if.directive';
import ForDirective from './directives/for.directive';

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

export const flattenDeepArray = (array) => {
  let result = [];

  for(let i = 0; i < array.length; i++) {
    if(array[i] && array[i].constructor === Array) {
      result.push(...flattenDeepArray(array[i]));
    }
    else {
      result.push(array[i]);
    }
  }

  return result;
};

export const HTML_SPECIAL_ATTRIBUTES = [
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

export const directivePropMap = {
  '_data': DataDirective,
  '_bind': BindDirective,
  '_if': IfDirective,
  '_for': ForDirective,
  '_switch': SwitchDirective,
};