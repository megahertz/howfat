'use strict';

const DependencyGraphBuilder = require('./DependencyGraphBuilder');
const DependencyCache        = require('./DependencyCache');
const makePackage            = require('./package');

module.exports = {
  buildDependencyGraphByName,
};

/**
 * @param {string} name
 * @param {string} version
 * @param {IOptions} options
 * @param {IGetPkgMeta} getPkgMeta
 * @param {IGetPkgStat} getPkgStat
 * @param {Function} [onDownload]
 * @return {Promise<BasicPackage>}
 */
function buildDependencyGraphByName(
  name,
  version,
  options,
  getPkgMeta,
  getPkgStat,
  onDownload = undefined
) {
  const builder = new DependencyGraphBuilder(
    options,
    getPkgMeta,
    getPkgStat,
    makePackage,
    new DependencyCache()
  );

  if (onDownload) {
    builder
      .on('fetch-meta', onDownload)
      .on('fetch-stat', onDownload);
  }

  return builder.buildByPackageName(name, version);
}
