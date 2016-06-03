# rfc6570-expand

A template processor for [RFC 6570 URI Template](https://tools.ietf.org/html/rfc6570).

## Installation

```
$ npm install rfc6570-expand
```

## Usage

```js
import { init } from 'rfc6570-expand';

const template = '{foo}';
const variables = { foo: 'bar' };
const { expand } = init(template);
const uri = expand(variables);

console.log(uri); // 'bar'
```

## Badges

[![Circle CI][circleci-badge-url]][circleci-url]

## License

[MIT](LICENSE)

## Author

[bouzuya][user] &lt;[m@bouzuya.net][email]&gt; ([http://bouzuya.net][url])

[user]: https://github.com/bouzuya
[email]: mailto:m@bouzuya.net
[url]: http://bouzuya.net
[circleci-badge-url]: https://circleci.com/gh/bouzuya/rfc6570-expand.svg?style=svg
[circleci-url]: https://circleci.com/gh/bouzuya/rfc6570-expand
