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

// s = '{...}'
const expression = (s: string, variables: any): string => {
  const { key, first, sep, named, ifemp, allow } = parseOperator(s);
  const hasOperator = !!key;
  const parser = varSpecParser();
  const varSpecs = s.slice((hasOperator ? 2 : 1), s.length - 1).split(',');
  return varSpecs.map(parser).map(({ varName, maxLength, explode }, index) => {
    const value = variables[varName];
    const isDefined = typeof value !== 'undefined' && value !== null;
    const isEmpty = !isDefined || value.length === 0;
    const prefixed = typeof maxLength === 'undefined'
      ? value : value.substring(0, maxLength);
    return (isDefined ? (index === 0 ? first : sep) : '') +
      (named ? allow(varName) + (isEmpty ? ifemp : '=') : '') +
      allow(prefixed);
  }).join('');
};

const literals = (s: string): string => {
  return s;
};

const init = (template: string): { expand: (variables: any) => string; } => {
  const expand = (variables: any): string => {
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
          variables
        )
      );

      index = closeIndex + 1;
    }
    return result.join('');
  };
  return { expand };
};

export { init };
