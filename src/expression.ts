import {
  Variable,
  Variables,
  isArray,
  isDefined,
  isObject,
  isString
} from './variables';
import {
  expressionParser
} from './expression-parser';

const parser = expressionParser();

const varSpecToString = (
  // operator
  allow: (s: string) => string,
  ifemp: string,
  named: boolean,
  sep: string,
  // varspec
  varName: string,
  explode: boolean,
  maxLength: number,
  // variables
  value: Variable,
  isEmpty: boolean
): string => {
  if (typeof maxLength !== 'undefined') {
    if (isString(value)) {
      return (named ? varName + (isEmpty ? ifemp : '=') : '') +
        allow(value.substring(0, maxLength));
    } else {
      throw new Error();
    }
  }
  return (explode
    ? (
      isArray(value)
        ? value.map(v => {
          return (named ? varName + (isEmpty ? ifemp : '=') : '') +
            allow(v);
        }).join(sep)
        : (
          isString(value)
            ? allow(value) // invalid
            : value.map(([k, v]) => {
              return allow(k) + (isEmpty ? ifemp : '=') + allow(v);
            }).join(sep))
    )
    : (
      (named ? varName + (isEmpty ? ifemp : '=') : '') +
      (isArray(value)
        ? value.map(allow).join(',')
        : (
          isString(value)
            ? allow(value)
            : value.map(([k, v]) => {
              return allow(k) + ',' + allow(v);
            }).join(',')))));
};

// s = '{...}'
const expression = (s: string, variables: Variables): string => {
  const { operator: { allow, first, ifemp, named, sep }, varSpecs } = parser(s);
  return varSpecs
    .map(varSpec => {
      const { varName } = varSpec;
      const value = variables[varName];
      return { value, varSpec };
    })
    .filter(({ value }) => {
      return isDefined(value) &&
        !(value.length === 0 && (isArray(value) || isObject(value)));
    })
    .map(({
      value,
      varSpec: { varName, maxLength, explode },
    }, index) => {
      const isFirst = index === 0;
      const isEmpty = value.length === 0;
      const firstOrSep = (isFirst ? first : sep);
      return firstOrSep + varSpecToString(
        allow, ifemp, named, sep,
        varName, explode, maxLength,
        value, isEmpty
      );
    }).join('');
};

export { expression };
