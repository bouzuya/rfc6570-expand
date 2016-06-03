import * as assert from 'power-assert';
import { test } from 'eater/runner';
import { init } from '../src/';
import { testCases } from '../test/';

const tests = testCases('extended-tests')
  .sort((a, b) => a.section < a.section ? 1 : a.section === a.section ? 0 : -1)
  .filter(({ section }) => !!section.match(/2/));
tests.forEach(testCase => {
  const { level, section, template, uris, variables } = testCase;
  test(`${section} - ${template}`, resolve => {
    const { expand } = init(template);
    const uri = expand(variables);
    assert(uris.some(u => u === uri), `${template} / ${uris} / ${uri}`);
    resolve();
  });
});
