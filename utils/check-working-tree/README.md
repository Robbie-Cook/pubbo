# `@pubbo/check-working-tree`

> Check git working tree status and error appropriately

## Usage

```js
const checkWorkingTree = require("@pubbo/check-working-tree");

// values listed here are their defaults
const options = {
  cwd: process.cwd(),
};

(async () => {
  try {
    await checkWorkingTree(options);
  } catch (err) {
    console.error(err.message);
    // "Working tree has uncommitted changes, ..."
  }
})();
```

Install [lerna](https://www.npmjs.com/package/lerna) for access to the `lerna` CLI.
