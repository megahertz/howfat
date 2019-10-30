'use strict';

const { isRightPlatform } = require('../utils/dependencySpec');
const graph = require('../dependency/graph');

class DependencyResolver {
  /**
   * @param {PackageFactory} packageFactory
   * @param {DependencyFactory} dependencyFactory
   * @param {DependencyTypeFilter} typeFilter
   * @param {DependencyCache} cache
   */
  constructor(packageFactory, dependencyFactory, typeFilter, cache) {
    this.packageFactory = packageFactory;
    this.dependencyFactory = dependencyFactory;
    this.typeFilter = typeFilter;
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
   * @return {Promise<Dependency>}
   * @private
   */
  async fetchDependency(dependency) {
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
        peer: this.typeFilter.peer,
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
