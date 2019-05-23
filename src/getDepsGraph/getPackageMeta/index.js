'use strict';

const npa     = require('npm-package-arg');
const Meta    = require('./Meta');
const NpmMeta = require('./NpmMeta');

module.exports = getPackageMeta;

/**
 * Return metadata of the package
 * @param {string} name
 * @param {string} [version]
 * @param {IMetaOptions} [options]
 * @return {Meta}
 */
function getPackageMeta(name, version, options = {}) {
  const npaResult = version ? npa.resolve(name, version) : npa(name);

  options = Object.assign({}, { getPackageMeta }, options);

  if (npaResult.registry) {
    return new NpmMeta({ npaResult, options });
  }

  return new Meta({ npaResult, options });
}
