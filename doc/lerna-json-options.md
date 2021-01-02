# Lerna JSON documentation

Below is a (very detailed) `lerna.json` file displaying most of the different options available:

```json
{
  "packages": ["commands/*", "core/*", "utils/*"],
  "command": {
    "create": {
      "homepage": "https://github.com/lerna/lerna",
      "license": "MIT"
    },
    "add": {},
    "bootstrap": {
      "ignore": "component-*"
    },
    "changed": {
      "json": true,
      "ndjson": false,
      "all": false,
      "long": false,
      "parseable": false,
      "toposort": false,
      "graph": false
    },
    "clean": {
      "yes": false
    },
    "version": {
      "allowBranch": "master",
      "amend": "",
      "changelog-preset": "",
      "conventional-commits": "",
      "conventional-graduate": "",
      "conventional-prerelease": "",
      "create-release": "",
      "exact": "",
      "force-publish": "",
      "git-remote": "",
      "ignore-changes": "",
      "ignore-scripts": "",
      "include-merged-tags": "",
      "message": "",
      "no-changelog": "",
      "no-commit-hooks": "",
      "no-git-tag-version": "",
      "no-granular-pathspec": "",
      "no-private": "",
      "no-push": "",
      "preid": "",
      "sign-git-commit": "",
      "sign-git-tag": "",
      "force-git-tag": "",
      "tag-version-prefix": "",
    }
  },
  "ignoreChanges": ["**/__fixtures__/**", "**/__tests__/**", "**/*.md"],
  "npmClient": "yarn",
  "useWorkspaces": true,
  "npmClientArgs": ["--production", "--no-optional"],
  "version": "0.0.0",
  "publishConfig": {
    "directory": "dist"
  }
}
```
