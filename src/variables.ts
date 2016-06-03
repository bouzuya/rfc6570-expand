export type Variable = string | string[] | [string, string][];

export type Variables = {
  [key: string]: Variable;
};

const isArray = (variable: Variable): variable is string[] => {
  return Array.isArray(variable) && !Array.isArray(variable[0]);
};

const isDefined = (variable: Variable): boolean => {
  return typeof variable !== 'undefined';
};

const isObject = (variable: Variable): variable is [string, string][] => {
  return Array.isArray(variable) && Array.isArray(variable[0]);
};

const isString = (variable: Variable): variable is string => {
  return typeof variable === 'string';
};

const normalizeVariable = (variable: any): Variable => {
  if (typeof variable === 'undefined') return undefined;
  if (variable === null) return undefined;
  if (typeof variable === 'boolean') return String(variable);
  if (typeof variable === 'number') return String(variable);
  if (typeof variable === 'string') return variable;
  if (typeof variable === 'object') {
    if (Array.isArray(variable)) {
      return variable.map(toString);
    } else {
      return Object.keys(variable).map((key): [string, string] => {
        return [key, toString(variable[key])];
      });
    }
  }
  if (typeof variable === 'function') return variable.toString(); // ?
  return variable.toString();
};

const normalizeVariables = (variables: { [key: string]: any; }): Variables => {
  return Object.keys(variables).map(key => {
    return [key, normalizeVariable(variables[key])];
  }).reduce((normalized: Variables, [key, value]: [string, string]) => {
    return Object.assign(normalized, { [key]: value });
  }, <Variables>{});
};

const toString = (variable: any): string => {
  if (typeof variable === 'undefined') return undefined;
  if (variable === null) return undefined;
  if (typeof variable === 'boolean') return String(variable);
  if (typeof variable === 'number') return String(variable);
  if (typeof variable === 'string') return variable;
  if (typeof variable === 'function') return variable.toString();
  return variable.toString();
};

export { isArray, isDefined, isObject, isString, normalizeVariables };
