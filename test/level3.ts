import * as assert from 'power-assert';
import { test } from 'eater/runner';
import { init } from '../src/';

test('level 3 examples', resolve => {
  const variables = {
    'var': 'value',
    'hello': 'Hello World!',
    'empty': '',
    'path': '/foo/bar',
    'x': '1024',
    'y': '768'
  };
  const testCases = [
    ['map?{x,y}', 'map?1024,768'],
    ['{x,hello,y}', '1024,Hello%20World%21,768'],
    ['{+x,hello,y}', '1024,Hello%20World!,768'],
    ['{+path,x}/here', '/foo/bar,1024/here'],
    ['{#x,hello,y}', '#1024,Hello%20World!,768'],
    ['{#path,x}/here', '#/foo/bar,1024/here'],
    ['X{.var}', 'X.value'],
    ['X{.x,y}', 'X.1024.768'],
    ['{/var}', '/value'],
    ['{/var,x}/here', '/value/1024/here'],
    ['{;x,y}', ';x=1024;y=768'],
    ['{;x,y,empty}', ';x=1024;y=768;empty'],
    ['{?x,y}', '?x=1024&y=768'],
    ['{?x,y,empty}', '?x=1024&y=768&empty='],
    ['?fixed=yes{&x}', '?fixed=yes&x=1024'],
    ['{&x,y,empty}', '&x=1024&y=768&empty=']
  ];
  testCases.forEach(([template, uri]) => {
    const { expand } = init(template);
    assert(expand(variables) === uri);
  });
  resolve();
});
