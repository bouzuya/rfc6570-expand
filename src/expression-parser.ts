export type Operator = {
  key: string;
  first: string;
  sep: string;
  named: boolean;
  ifemp: string;
  allow: (s: string) => string;
};

export type VarSpec = {
  varName: string;
  maxLength?: number;
  explode: boolean;
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

const compileVarSpecPattern = (): RegExp => {
  const varChar = '(?:[A-Za-z0-9_]|%[A-Fa-f0-9][A-Fa-f0-9])';
  const varName = `(${varChar}(?:\\.?${varChar})*?)`;
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

export { expressionParser };
