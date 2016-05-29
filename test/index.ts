import * as assert from 'power-assert';
import { test } from 'eater/runner';
import { init } from '../src/';

test('literals', resolve => {
  const template = 'foo';
  const variables = {};
  const uri = 'foo';
  const { expand } = init(template);
  assert(expand(variables) === uri);
  resolve();
});

test('expression', resolve => {
  const template = 'foo{bar}baz';
  const variables = { bar: 'BAR' };
  const uri = 'fooBARbaz';
  const { expand } = init(template);
  assert(expand(variables) === uri);
  resolve();
});
