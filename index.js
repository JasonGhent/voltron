'use strict';

const voltron = require('./lib/voltron');

function pipe(fns, val) {
  return fns.reduce((curVal, fn) => fn(curVal), val);
}

module.exports = function(opts) {
  let extNames = pipe([
    voltron.findPackageJson,
    voltron.getExtensionNames
  ], opts.cwd);

  return voltron.installDevDeps(extNames, opts.cwd)
    .then(_ => voltron.getConfigs(extNames, opts.cwd))
    .then(configs => {
      return voltron.buildExtensions(configs, opts.buildOpts)
        .then(() => voltron.updateManifest(configs, opts.manifest));
    });
};
