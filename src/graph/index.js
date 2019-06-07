'use strict';

const DependencyGraphBuilder = require('./DependencyGraphBuilder');
const DependencyCache        = require('./DependencyCache');
const downloaderFactory      = require('./downloaderFactory');
const packageFactory         = require('./package');

module.exports = {
  buildDependencyGraphByName,
};

/**
 * @param {string} name
 * @param {string} [version]
 * @param {IOptions} [options]
 * @return {Promise<BasicPackage>}
 */
function buildDependencyGraphByName(name, version = '', options = {}) {
  const builder = new DependencyGraphBuilder(
    options,
    downloaderFactory({ debug: options.debug }),
    packageFactory,
    new DependencyCache()
  );

  return builder.buildByPackageName(name, version);
}
