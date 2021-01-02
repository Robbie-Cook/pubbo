"use strict";

const cli = require("@pubbo/cli");

const addCmd = require("@pubbo/add/command");
const bootstrapCmd = require("@pubbo/bootstrap/command");
const changedCmd = require("@pubbo/changed/command");
const cleanCmd = require("@pubbo/clean/command");
const createCmd = require("@pubbo/create/command");
const diffCmd = require("@pubbo/diff/command");
const execCmd = require("@pubbo/exec/command");
const importCmd = require("@pubbo/import/command");
const infoCmd = require("@pubbo/info/command");
const initCmd = require("@pubbo/init/command");
const linkCmd = require("@pubbo/link/command");
const listCmd = require("@pubbo/list/command");
const publishCmd = require("@pubbo/publish/command");
const runCmd = require("@pubbo/run/command");
const versionCmd = require("@pubbo/version/command");

const pkg = require("./package.json");

module.exports = main;

function main(argv) {
  const context = {
    lernaVersion: pkg.version,
  };

  return cli()
    .command(addCmd)
    .command(bootstrapCmd)
    .command(changedCmd)
    .command(cleanCmd)
    .command(createCmd)
    .command(diffCmd)
    .command(execCmd)
    .command(importCmd)
    .command(infoCmd)
    .command(initCmd)
    .command(linkCmd)
    .command(listCmd)
    .command(publishCmd)
    .command(runCmd)
    .command(versionCmd)
    .parse(argv, context);
}
