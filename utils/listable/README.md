# `@pubbo/listable`

> Shared logic for listing package information

This is an internal package for [Lerna](https://github.com/lerna/lerna/#readme), YMMV.

## Usage

### `listable.format()`

```js
const listable = require("@pubbo/listable");

const { text, count } = listable.format(packages, options);
```

### `listable.options()`

```js
const listable = require("@pubbo/listable");

exports.builder = yargs => {
  listable.options(yargs);
};
```

Install [lerna](https://www.npmjs.com/package/lerna) for access to the `lerna` CLI.
