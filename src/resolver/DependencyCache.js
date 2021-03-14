'use strict';

const { getLatestVersion } = require('../utils/spec');

class DependencyCache {
  constructor() {
    /**
     * @type {Object<string, RealDependency[]>}
     */
    this.cache = {};
  }

  /**
   * @param {RealDependency} dependency
   */
  add(dependency) {
    const name = dependency.spec.name;
    if (!name) {
      return;
    }

    this.cache[name] = this.cache[name] || [];
    this.cache[name].push(dependency);
  }

  /**
   * @param {DependencySpec} dependencySpec
   * @return {RealDependency}
   */
  async find(dependencySpec) {
    const similar = this.cache[dependencySpec.name];
    if (!similar) {
      return null;
    }

    const pkg = this.findSatisfyingPackage(similar, dependencySpec.versionSpec);
    if (pkg) {
      return pkg;
    }

    await this.waitForPendingDependencies(similar);

    return this.findSatisfyingPackage(similar, dependencySpec.versionSpec);
  }

  /**
   * @param {RealDependency} newDep
   * @param {RealDependency} oldDep
   */
  replace(newDep, oldDep) {
    const similar = this.cache[oldDep.spec.name];
    if (!similar) {
      return;
    }

    const index = similar.indexOf(oldDep);
    if (index < 0) {
      return;
    }

    similar[index] = newDep;
  }

  /**
   * @param {RealDependency[]} dependencies
   * @param {string} versionSpec
   * @return {?RealDependency}
   * @private
   */
  findSatisfyingPackage(dependencies, versionSpec) {
    const versions = dependencies.map((dep) => dep.version).filter(Boolean);
    const maxVersion = getLatestVersion(versions, versionSpec);
    return dependencies.find((pkg) => pkg.version === maxVersion);
  }

  /**
   * @param {RealDependency[]} dependencies
   * @return {Promise<void>}
   */
  async waitForPendingDependencies(dependencies) {
    const pending = dependencies
      .filter((dep) => !dep.version)
      .map((pkg) => pkg.waitForResolve());

    return Promise.all(pending);
  }
}

module.exports = DependencyCache;
