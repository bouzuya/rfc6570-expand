import * as assert from 'power-assert';
import { test } from 'eater/runner';
import { init } from '../src/';
import { testCases } from '../test/';

testCases('negative-tests').forEach(testCase => {
  const { level, section, template, uris, variables } = testCase;
  test(`${section} - ${template}`, resolve => {
    const { expand } = init(template);
    assert.throws(() => expand(variables));
    resolve();
  });
});
