import * as assert from 'power-assert';
import { test } from 'beater';
import { init } from '../src/';
import { testCases } from '../test/';

const tests = testCases('spec-examples').filter(({ level }) => level === 3);
tests.forEach(testCase => {
  const { level, section, template, uris, variables } = testCase;
  test(`${section} - ${level} - ${template}`, () => {
    const { expand } = init(template);
    const uri = expand(variables);
    assert(uris.some(u => u === uri), `${template} / ${uris} / ${uri}`);
  });
});
