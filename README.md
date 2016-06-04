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

## Alternatives

- [LuvDaSun/rfc6570][] ([npm:rfc6570][])
- [bramstein/url-template][] ([npm:url-template][])
- [brettstimmerman/temple][] ([npm:temple][])
- [fxa/uritemplate-js][] ([npm:uritemplate][])
- [geraintluff/uri-templates][] ([npm:uri-templates][])
- [grncdr/uri-template][] ([npm:uri-template][])
- [litejs/uri-template-lite][] ([npm:uri-template-lite][])
- [medialize/URI.js][] ([npm:urijs][])
- [rezigned/uri-template.js][] ([npm:uri-template.js][])

[LuvDaSun/rfc6570]: https://github.com/LuvDaSun/rfc6570
[bramstein/url-template]: https://github.com/bramstein/url-template
[brettstimmerman/temple]: https://github.com/brettstimmerman/temple
[fxa/uritemplate-js]: https://github.com/fxa/uritemplate-js
[geraintluff/uri-templates]: https://github.com/geraintluff/uri-templates
[grncdr/uri-template]: https://github.com/grncdr/uri-template
[litejs/uri-template-lite]: https://github.com/litejs/uri-template-lite
[medialize/URI.js]: https://github.com/medialize/URI.js
[rezigned/uri-template.js]: https://github.com/rezigned/uri-template.js
[npm:rfc6570]: https://www.npmjs.com/package/rfc6570
[npm:uri-templates]: https://www.npmjs.com/package/uri-templates
[npm:uritemplate]: https://www.npmjs.com/package/uritemplate
[npm:uri-template.js]: https://www.npmjs.com/package/uri-template.js
[npm:uri-template-lite]: https://www.npmjs.com/package/uri-template-lite
[npm:uri-template]: https://www.npmjs.com/package/uri-template
[npm:url-template]: https://www.npmjs.com/package/url-template
[npm:urijs]: https://www.npmjs.com/package/urijs
[npm:temple]: https://www.npmjs.com/package/temple

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
