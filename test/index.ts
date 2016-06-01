import * as fs from 'fs';

type Examples = {
  [section: string]: {
    level?: number;
    variables: { [key: string]: any; };
    testcases: [string, string | string[]][];
  };
};

type TestCase = {
  level?: number;
  section: string;
  template: string;
  uris: string[];
  variables: any;
};

const loadExamples = (key: string): Examples => {
  const fileName = `${__dirname}/../../uritemplate-test/${key}.json`;
  const data = fs.readFileSync(fileName, { encoding: 'utf-8' });
  return JSON.parse(data);
};

const parseExamples = (examples: Examples): TestCase[] => {
  return Object.keys(examples).reduce((allTestCases, section) => {
    const { level, variables, testcases } = examples[section];
    const newTestCases = testcases.map(([template, uriOrUris]) => {
      const uris = typeof uriOrUris === 'string' ? [uriOrUris] : uriOrUris;
      return { level, section, template, uris, variables };
    });
    return allTestCases.concat(newTestCases);
  }, []);
};

const testCases = (key: string): TestCase[] => {
  const examples = loadExamples(key);
  return parseExamples(examples);
};

export { testCases };
