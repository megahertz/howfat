'use strict';

const DependenciesGraphBuilder = require('./DependenciesGraphBuilder');
const DependencyCache          = require('./DependencyCache');
const downloaderFactory        = require('./downloaderFactory');
const packageFactory           = require('./package');

module.exports = {
  buildDependenciesGraphByName,
};

/**
 * @param {string} name
 * @param {string} [version]
 * @param {IOptions} [options]
 * @return {Promise<BasicPackage>}
 */
function buildDependenciesGraphByName(name, version = '', options = {}) {
  const builder = new DependenciesGraphBuilder(
    options,
    downloaderFactory({ debug: options.debug }),
    packageFactory,
    new DependencyCache()
  );

  return builder.buildByPackageName(name, version);
}
