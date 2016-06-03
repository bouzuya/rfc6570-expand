import { normalizeVariables } from './variables';
import { expression } from './expression';
import { literals } from './literals';

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
