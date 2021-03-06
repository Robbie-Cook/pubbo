"use strict";

const globby = require("globby");
const pMap = require("p-map");
const path = require("path");
const ValidationError = require("@pubbo/validation-error");

module.exports.makeFileFinder = makeFileFinder;
module.exports.makeSyncFileFinder = makeSyncFileFinder;

function getGlobOpts(rootPath, packageConfigs) {
  const globOpts = {
    cwd: rootPath,
    absolute: true,
    expandDirectories: false,
    followSymlinkedDirectories: false,
    // POSIX results always need to be normalized
    transform: fp => path.normalize(fp),
  };

  if (packageConfigs.some(cfg => cfg.indexOf("**") > -1)) {
    if (packageConfigs.some(cfg => cfg.indexOf("node_modules") > -1)) {
      throw new ValidationError(
        "EPKGCONFIG",
        "An explicit node_modules package path does not allow globstars (**)"
      );
    }

    globOpts.ignore = [
      // allow globs like "packages/**",
      // but avoid picking up node_modules/**/package.json
      "**/node_modules/**",
    ];
  }

  return globOpts;
}

function makeFileFinder(rootPath, packageConfigs) {
  const globOpts = getGlobOpts(rootPath, packageConfigs);

  return (fileName, fileMapper, customGlobOpts) => {
    const options = Object.assign({}, customGlobOpts, globOpts);
    const promise = pMap(
      Array.from(packageConfigs).sort(),
      globPath => {
        let chain = globby(path.join(globPath, fileName), options);

        // fast-glob does not respect pattern order, so we re-sort by absolute path
        chain = chain.then(results => results.sort());

        if (fileMapper) {
          chain = chain.then(fileMapper);
        }

        return chain;
      },
      { concurrency: 4 }
    );

    // always flatten the results
    return promise.then(results => results.reduce((acc, result) => acc.concat(result), []));
  };
}

function makeSyncFileFinder(rootPath, packageConfigs) {
  const globOpts = getGlobOpts(rootPath, packageConfigs);

  return (fileName, fileMapper, customGlobOpts) => {
    const options = Object.assign({}, customGlobOpts, globOpts);
    const patterns = packageConfigs.map(globPath => path.join(globPath, fileName)).sort();

    let results = globby.sync(patterns, options);

    /* istanbul ignore else */
    if (fileMapper) {
      results = results.map(fileMapper);
    }

    return results;
  };
}
