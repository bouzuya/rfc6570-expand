import * as assert from 'power-assert';
import { test } from 'eater/runner';
import { init } from '../src/';
import { testCases } from '../test/';

testCases('spec-examples').forEach(testCase => {
  const { level, section, template, uris, variables } = testCase;
  if (level !== 1 && level !== 2 && level !== 3) return;
  test(`${section} - ${level} - ${template}`, resolve => {
    const { expand } = init(template);
    const uri = expand(variables);
    assert(uris.some(u => u === uri), `${uri} / ${uris}`);
    resolve();
  });
});
