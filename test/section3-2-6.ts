import * as assert from 'power-assert';
import { test } from 'beater';
import { init } from '../src/';
import { testCases } from '../test/';

const tests = testCases('spec-examples-by-section')
  .sort((a, b) => a.section < a.section ? 1 : a.section === a.section ? 0 : -1)
  .filter(({ section }) => !!section.match(/^3.2.6/));
tests.forEach(testCase => {
  const { level, section, template, uris, variables } = testCase;
  test(`${section} - ${template}`, () => {
    const { expand } = init(template);
    const uri = expand(variables);
    assert(uris.some(u => u === uri), `${template} / ${uris} / ${uri}`);
  });
});
