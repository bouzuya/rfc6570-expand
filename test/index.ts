import assert from 'power-assert';
import { test } from 'eater/runner';
import { init } from '../src/';

test('test', resolve => {
  const template = 'foo';
  const variables = {};
  const uri = 'foo';
  const { expand } = init(template);
  assert(expand(variables) === uri);
  resolve();
});
