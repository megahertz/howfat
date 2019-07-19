'use strict';

/**
 * @implements {IDownloadItem}
 */
class BasicPackage {
  /**
   * @param {IPackageConstructData} data
   */
  constructor(data) {
    /** @type {INpaResult} */
    this.npaResult = data.npaResult;

    /** @type {IOptions} */
    this.options = data.options;

    /** @type {BasicPackage} */
    this.parent = undefined;

    /** @type {IDependencies} */
    this.dependencies = {};

    /** @type {IDependencies} */
    this.devDependencies = {};

    /** @type {IDependencies} */
    this.peerDependencies = {};

    /** @type {IDependencies} */
    this.optionalDependencies = {};

    this.fileCount = -1;
    this.unpackedSize = -1;

    /** @type {string} */
    this.tarballUrl = undefined;

    /** @type {string} */
    this.version = undefined;

    /**
     * True if the dependency is already resolved for the graph
     * @type {boolean}
     */
    this.isDuplicated = false;
  }

  get name() {
    return this.npaResult.name;
  }

  get versionSpec() {
    return this.npaResult.rawSpec;
  }

  /**
   * Url where package.json or similar file can be found
   * @return {string}
   */
  get url() {
    throw new Error(`Unknown url for ${this.npaResult.raw}`);
  }

  /**
   * @param {*} packageJson
   * @param {IPackageFactory} packageFactory
   */
  addPackageInformation(packageJson, packageFactory) {
    this.dependencies = this.transformDependencies(
      packageJson.dependencies,
      packageFactory
    );

    if (this.options.fetchDevDependencies && !this.parent) {
      this.devDependencies = this.transformDependencies(
        packageJson.devDependencies,
        packageFactory
      );
    }

    if (this.options.fetchPeerDependencies) {
      this.peerDependencies = this.transformDependencies(
        packageJson.peerDependencies,
        packageFactory
      );
    }

    if (this.options.fetchOptionalDependencies) {
      this.optionalDependencies = this.transformDependencies(
        packageJson.optionalDependencies,
        packageFactory
      );
    }

    this.version = this.getVersion(packageJson);
  }

  /**
   * Return the exact package version
   * @param {*} packageJson
   */
  getVersion(packageJson) {
    return packageJson.version;
  }

  /**
   * Merge all dependencies and return as an array
   * @param {boolean} [recursive]
   * @return {BasicPackage[]}
   */
  getDependenciesAsArray(recursive = false) {
    const dependencies = Object
      .values(this.dependencies)
      .concat(Object.values(this.devDependencies))
      .concat(Object.values(this.peerDependencies))
      .concat(Object.values(this.optionalDependencies));

    if (!recursive) {
      return dependencies;
    }

    return dependencies.reduce((result, dep) => {
      return result.concat(dep.getDependenciesAsArray(true));
    }, dependencies);
  }

  /**
   * Return statistic of the meta together with nested dependencies
   * @return {IStats}
   */
  getStats() {
    const dependencies = this.getDependenciesAsArray(true);
    dependencies.push(this);

    const stats = {
      depCount: -1,
      fileCount: 0,
      unpackedSize: 0,
    };

    dependencies.forEach((dep) => {
      if (dep.isDuplicated) {
        return;
      }

      stats.depCount++;
      stats.fileCount += Math.max(0, dep.fileCount || 0);
      stats.unpackedSize += Math.max(0, dep.unpackedSize || 0);
    });

    return stats;
  }

  /**
   * Transform simple dependencies to Meta objects
   * @param {IDependencies} dependencies
   * @param {IPackageFactory} packageFactory
   * @return {IDependencies}
   * @protected
   */
  transformDependencies(dependencies, packageFactory) {
    return Object.entries(dependencies || {}).reduce((result, [name, spec]) => {
      result[name] = packageFactory(name, spec, this.options);
      result[name].parent = this;
      return result;
    }, {});
  }
}

module.exports = BasicPackage;
