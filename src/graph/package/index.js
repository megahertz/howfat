'use strict';

const npa          = require('npm-package-arg');
const BasicPackage = require('./BasicPackage');
const NpmPackage   = require('./NpmPackage');

module.exports = makePackage;

/**
 * Makes a Package instance using name and version
 * @param {string} name
 * @param {string} [version]
 * @param {IOptions} [options]
 * @return {BasicPackage}
 */
function makePackage(name, version, options = {}) {
  const npaResult = version ? npa.resolve(name, version) : npa(name);

  if (npaResult.registry) {
    return new NpmPackage({ npaResult, options });
  }

  return new BasicPackage({ npaResult, options });
}
