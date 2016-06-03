const ps = '^(?:[^\\cA-\\cZ"\'<>\\\\^`{|}]|%(?![A-Fa-f0-9][A-Fa-f0-9]))*$';
const p = new RegExp(ps);

const literals = (s: string): string => {
  if (!s.match(p)) throw new Error();
  return s;
};

export { literals };
