'use strict';

const { isRightPlatform } = require('../utils/dependencySpec');
const graph = require('../dependency/graph');

class DependencyResolver {
  /**
   * @param {HttpClient} httpClient
   * @param {DependencyTypeFilter} typeFilter
   * @param {DependencyFactory} dependencyFactory
   * @param {PackageFactory} packageFactory
   * @param {DependencyCache} cache
   */
  constructor(
    httpClient,
    typeFilter,
    dependencyFactory,
    packageFactory,
    cache
  ) {
    this.httpClient = httpClient;
    this.typeFilter = typeFilter;
    this.dependencyFactory = dependencyFactory;
    this.packageFactory = packageFactory;
    this.cache = cache;

    this.fetchDependency = this.fetchDependency.bind(this);
  }

  /**
   * @param {Dependency} dependency
   * @return {Promise<Dependency>}
   */
  async resolve(dependency) {
    return graph.mapAsync(dependency, this.fetchDependency);
  }

  /**
   * @param {(Dependency | RealDependency)} dependency
   * @param {number} index
   * @param {Dependency} parent
   * @return {Promise<Dependency>}
   * @private
   */
  async fetchDependency(dependency, index, parent) {
    if (!dependency.isReal()) {
      return dependency;
    }

    const cached = await this.findOrRegisterInCache(dependency);
    if (cached) {
      return this.dependencyFactory.createDuplicate(cached, dependency);
    }

    const pkg = await this.packageFactory.create(dependency.spec);

    dependency.setPackage(pkg);

    if (!isRightPlatform(pkg.requirements)) {
      const unmet = this.dependencyFactory.createUnmet(dependency);
      this.cache.replace(dependency, unmet);
      return unmet;
    }

    const children = this.dependencyFactory.createDependenciesOfPackage(
      pkg,
      {
        dev: this.typeFilter.dev && dependency.canIncludeDevDependencies(),
        peer: this.typeFilter.peer === true,
      }
    );
    dependency.loadChildren(children);

    return dependency;
  }

  /**
   * @param {RealDependency} dependency
   * @return {Promise<(RealDependency | null)>}
   * @private
   */
  async findOrRegisterInCache(dependency) {
    const cached = await this.cache.find(dependency.spec);

    if (!cached) {
      this.cache.add(dependency);
    }

    return cached;
  }
}

module.exports = DependencyResolver;
