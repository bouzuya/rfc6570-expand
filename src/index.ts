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

      const expression = template.slice(openIndex + 1, closeIndex);
      result.push(expression);

      index = closeIndex + 1;
    }
    return result.join('');
  };
  return { expand };
};

export { init };
