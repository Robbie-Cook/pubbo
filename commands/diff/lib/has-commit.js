"use strict";

const log = require("npmlog");
const childProcess = require("@pubbo/child-process");

module.exports = hasCommit;

function hasCommit(opts) {
  log.silly("hasCommit");
  let retVal;

  try {
    childProcess.execSync("git", ["log"], opts);
    retVal = true;
  } catch (e) {
    retVal = false;
  }

  log.verbose("hasCommit", retVal);
  return retVal;
}
