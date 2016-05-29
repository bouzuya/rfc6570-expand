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

// s = '{...}'
const expression = (s: string, variables: any): string => {
  const { key, first, sep, named, ifemp, allow } = parseOperator(s);
  const hasOperator = !!key;
  const varNames = s.slice((hasOperator ? 2 : 1), s.length - 1).split(',');
  return first + varNames.map(varName => {
    const value = variables[varName];
    const isEmpty = typeof value === 'undefined' ||
      value === null ||
      value.length === 0;
    return (named ? allow(varName) + (isEmpty ? ifemp : '=') : '') + allow(value);
  }).filter(s => s.length > 0).join(sep);
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
