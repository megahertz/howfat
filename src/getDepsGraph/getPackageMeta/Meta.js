'use strict';

/**
 * @implements {IDownloadItem}
 */
class Meta {
  /**
   * @param {IMetaData} data
   */
  constructor(data) {
    /** @type {INpaResult} */
    this.npaResult = data.npaResult;

    /** @type {IMetaOptions} */
    this.options = data.options;

    /** @type {Meta} */
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
    this.exactName = undefined;
  }

  /**
   * Url where package.json or similar file can be found
   * @type string
   */
  get url() {
    throw new Error(`Unknown url for ${this.npaResult.raw}`);
  }

  /**
   * Add additional meta information from package.json
   * @param packageJson
   */
  addPackageInformation(packageJson) {

  }

  /**
   * Return the exact package version
   * @param {any} packageJson
   */
  getVersion(packageJson) {
    return this.npaResult.rawSpec;
  }

  /**
   * Merge all dependencies and return as an array
   * @return {Meta[]}
   */
  getDependenciesAsArray() {
    return Object
      .values(this.dependencies)
      .concat(Object.values(this.devDependencies))
      .concat(Object.values(this.peerDependencies))
      .concat(Object.values(this.optionalDependencies));
  }

  /**
   * Return statistic of the meta together with nested dependencies
   * @return {IStats}
   */
  getStats() {
    const deps = this.getDependenciesAsArray();

    const stats = {
      depCount: deps.length,
      fileCount: Math.max(0, this.fileCount),
      unpackedSize: Math.max(0, this.unpackedSize),
    };

    deps.forEach((dep) => {
      const depStats = dep.getStats();
      stats.depCount += depStats.depCount || 0;
      stats.fileCount += depStats.fileCount || 0;
      stats.unpackedSize += depStats.unpackedSize || 0;
    });

    return stats;
  }

  /**
   * Transform simple dependencies to Meta objects
   * @param {IDependencies} dependencies
   * @return {IDependencies}
   * @protected
   */
  transformDependencies(dependencies) {
    return Object.entries(dependencies || {}).reduce((result, [name, spec]) => {
      result[name] = this.options.getPackageMeta(name, spec, this.options);
      result[name].parent = this;
      return result;
    }, {});
  }
}

module.exports = Meta;
