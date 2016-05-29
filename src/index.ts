const init = (template: string): { expand: (variables: any) => string; } => {
  const expand = (variables: any): string => {
    return template;
  };
  return { expand };
};

export { init };
