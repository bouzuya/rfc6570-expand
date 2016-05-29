type Operator = {
  key: string;
  first: string;
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
  const operators = [
    { key: '+', first: '', allow: ur },
    // { key: '.' },
    // { key: '/' },
    // { key: ';' },
    // { key: '?' },
    // { key: '&' },
    { key: '#', first: '#', allow: ur }
  ];
  const operator = operators.find(o => o.key === expression.charAt(1));
  return operator ? operator : { key: null, first: '', allow: u };
};

const init = (template: string): { expand: (variables: any) => string; } => {
  const expand = (variables: any): string => {
    const result: string[] = [];
    let index = 0;
    while (true) {
      const openIndex = template.indexOf('{', index);
      if (openIndex < 0) {
        const literal = template.slice(index);
        result.push(literal);
        break;
      }
      const literal = template.slice(index, openIndex);
      result.push(literal);

      const closeIndex = template.indexOf('}', openIndex + 1);
      if (closeIndex < 0) {
        // TODO: Error
        throw new Error();
      }

      const expression = template.slice(openIndex, closeIndex + 1);
      const { key, first, allow } = parseOperator(expression);
      const varName = expression.slice((key ? 2 : 1), expression.length - 1);
      const value = variables[varName];
      result.push(first + allow(value));

      index = closeIndex + 1;
    }
    return result.join('');
  };
  return { expand };
};

export { init };
