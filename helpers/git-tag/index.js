"use strict";

const execa = require("execa");

module.exports = gitTag;

function gitTag(cwd, tagName) {
  return execa("git", ["tag", tagName, "-m", tagName], { cwd });
}
