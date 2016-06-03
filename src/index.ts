type Operator = {
  key: string;
  first: string;
  sep: string;
  named: boolean;
  ifemp: string;
  allow: (s: string) => string;
};

const u = (s: string): string => {
  return encodeURIComponent(s).replace(/[!'()*]/g, (c) => {
    return '%' + c.charCodeAt(0).toString(16);
  });
};

const ur = (s: string): string => {
  return encodeURI(s).replace(/%5B/g, '[').replace(/%5D/g, ']');
};

const isArray = (variable: Variable): variable is string[] => {
  return Array.isArray(variable) && !Array.isArray(variable[0]);
};

const isObject = (variable: Variable): variable is [string, string][] => {
  return Array.isArray(variable) && Array.isArray(variable[0]);
};

const parseOperator = (expression: string): Operator => {
  const defaultOperator: Operator = {
    key: null, first: '', sep: ',', named: false, ifemp: '', allow: u
  };
  const operators: Operator[] = [
    { key: '+', first: '', sep: ',', named: false, ifemp: '', allow: ur },
    { key: '.', first: '.', sep: '.', named: false, ifemp: '', allow: u },
    { key: '/', first: '/', sep: '/', named: false, ifemp: '', allow: u },
    { key: ';', first: ';', sep: ';', named: true, ifemp: '', allow: u },
    { key: '?', first: '?', sep: '&', named: true, ifemp: '=', allow: u },
    { key: '&', first: '&', sep: '&', named: true, ifemp: '=', allow: u },
    { key: '#', first: '#', sep: ',', named: false, ifemp: '', allow: ur }
  ];
  const operator = operators.find(o => o.key === expression.charAt(1));
  return operator ? operator : defaultOperator;
};

type VarSpec = {
  varName: string;
  maxLength?: number;
  explode: boolean;
};

const compileVarSpecPattern = (): RegExp => {
  const varChar = '(?:[A-Za-z0-9_]|%[A-Fa-f0-9][A-Fa-f0-9])';
  const varName = `(${varChar}(?:\.?${varChar})*?)`;
  const prefix = ':([1-9][0-9]{0,3})';
  const explode = '(\\*)';
  const modifierLevel4 = `${prefix}|${explode}`;
  const varSpecPattern = new RegExp(`^${varName}(?:${modifierLevel4})?$`);
  return varSpecPattern;
};

const parseVarSpec = (p: RegExp, s: string): VarSpec => {
  const match = s.match(p);
  if (!match) throw new Error('invalid varspec');
  const varName = match[1];
  const maxLength = typeof match[2] === 'undefined'
    ? undefined : parseInt(match[2], 10);
  const explode = !!match[3];
  return { varName, maxLength, explode };
};

const varSpecParser = (): (s: string) => VarSpec => {
  const p = compileVarSpecPattern();
  return (s: string) => parseVarSpec(p, s);
};

const expressionParser = (): (s: string) => {
  operator: Operator;
  varSpecs: VarSpec[];
} => {
  const parser = varSpecParser();
  return s => {
    const operator = parseOperator(s);
    const hasOperator = !!operator.key;
    const varSpecs = s
      .slice((hasOperator ? 2 : 1), s.length - 1)
      .split(',')
      .map(parser);
    return {
      operator,
      varSpecs
    };
  };
};

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
  return (explode
    ? (
      isArray(value)
        ? value.map((v: any) => {
          return (named ? allow(varName) + (isEmpty ? ifemp : '=') : '') +
            allow(v);
        }).join(sep)
        : (
          typeof value === 'string'
            ? '' // invalid
            : value.map(([k, v]) => {
              return allow(k) + (isEmpty ? ifemp : '=') + allow(v);
            }).join(sep))
    )
    : (
      (named ? allow(varName) + (isEmpty ? ifemp : '=') : '') +
      (isArray(value)
        ? value.map(allow).join(',')
        : (
          typeof value === 'string'
            ? allow(
              typeof maxLength === 'undefined'
                ? value
                : value.substring(0, maxLength))
            : value.map(([k, v]) => {
              return allow(k) + ',' + allow(v);
            }).join(',')))));
};

type Variable = string | string[] | [string, string][];
type Variables = {
  [key: string]: Variable;
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

// s = '{...}'
const expression = (s: string, variables: any): string => {
  const parser = expressionParser();
  const { operator: { allow, first, ifemp, named, sep }, varSpecs } = parser(s);
  return varSpecs
    .map(varSpec => {
      const { varName } = varSpec;
      const value = variables[varName];
      const isDefined = typeof value !== 'undefined' && value !== null;
      return { isDefined, value, varSpec };
    })
    .filter(({ isDefined }) => isDefined)
    .map(({
      isDefined,
      value,
      varSpec: { varName, maxLength, explode },
    }, index) => {
      const isFirst = index === 0;
      const isEmpty = !isDefined || value.length === 0;
      const firstOrSep = (isFirst ? first : sep);
      return firstOrSep + varSpecToString(
        allow, ifemp, named, sep,
        varName, explode, maxLength,
        value, isEmpty
      );
    }).join('');
};

const literals = (s: string): string => {
  return s;
};

const init = (template: string): { expand: (variables: any) => string; } => {
  const expand = (variables: any): string => {
    const normalized = normalizeVariables(variables);
    const result: string[] = [];
    let index = 0;
    while (true) {
      const openIndex = template.indexOf('{', index);
      if (openIndex < 0) {
        result.push(literals(template.slice(index)));
        break;
      }
      result.push(literals(template.slice(index, openIndex)));

      const closeIndex = template.indexOf('}', openIndex + 1);
      if (closeIndex < 0) {
        // TODO: Error
        throw new Error();
      }

      result.push(
        expression(
          template.slice(openIndex, closeIndex + 1),
          normalized
        )
      );

      index = closeIndex + 1;
    }
    return result.join('');
  };
  return { expand };
};

export { init };
