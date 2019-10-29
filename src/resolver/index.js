'use strict';

const DependencyCache = require('./DependencyCache');
const DependencyResolver = require('./DependencyResolver');
const { createPackageFactory } = require('../package');
const { createDependencyFactory } = require('../dependency');


module.exports = {
  createDependencyResolver,
};

/**
 * @param {HttpClient} httpClient
 * @param {DependencyTypeFilter} typeFilter
 * @param {DependencyFactory} dependencyFactory
 * @param {PackageFactory} packageFactory
 * @return {DependencyResolver}
 */
function createDependencyResolver(
  httpClient,
  typeFilter = {},
  dependencyFactory = createDependencyFactory(),
  packageFactory = createPackageFactory(httpClient)
) {
  return new DependencyResolver(
    httpClient,
    typeFilter,
    dependencyFactory,
    packageFactory,
    new DependencyCache()
  );
}
