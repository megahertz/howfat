'use strict';

const DependencyCache = require('./DependencyCache');
const DependencyResolver = require('./DependencyResolver');
const { createDependencyFactory } = require('../dependency');

module.exports = {
  createDependencyResolver,
};

/**
 * @param {PackageFactory} packageFactory
 * @param {DependencyFactory} dependencyFactory
 * @param {DependencyTypeFilter} typeFilter
 * @return {DependencyResolver}
 */
function createDependencyResolver(
  packageFactory,
  dependencyFactory = createDependencyFactory(),
  typeFilter = {}
) {
  return new DependencyResolver(
    packageFactory,
    dependencyFactory,
    typeFilter,
    new DependencyCache()
  );
}
