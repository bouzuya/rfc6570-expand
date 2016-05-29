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

test('level 1 examples', resolve => {
  const variables = { 'var': 'value', 'hello': 'Hello World!' };
  const testCases = [
    ['{var}', 'value'],
    ['{hello}', 'Hello%20World%21']
  ];
  testCases.forEach(([template, uri]) => {
    const { expand } = init(template);
    assert(expand(variables) === uri);
  });
  resolve();
});

test('level 2 examples', resolve => {
  const variables = {
    'var': 'value',
    'hello': 'Hello World!',
    'path': '/foo/bar'
  };
  const testCases = [
    ['{+var}', 'value'],
    ['{+hello}', 'Hello%20World!'],
    ['{+path}/here', '/foo/bar/here'],
    ['here?ref={+path}', 'here?ref=/foo/bar'],
    ['X{#var}', 'X#value'],
    ['X{#hello}', 'X#Hello%20World!']
  ];
  testCases.forEach(([template, uri]) => {
    const { expand } = init(template);
    assert(expand(variables) === uri);
  });
  resolve();
});
