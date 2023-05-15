'use strict';

const graph = require('./graph');

class Dependency {
  constructor() {
    /**
     * @type {Dependency[]}
     */
    this.children = [];

    /**
     * @private
     */
    this.onLoadDependencies = {
      handler: () => {},
    };
    this.onLoadDependencies.promise = new Promise((resolve) => {
      this.onLoadDependencies.handler = resolve;
    });
  }

  canIncludeDevDependencies() {
    return false;
  }

  /**
   * @return {Dependency[]}
   */
  flatChildren() {
    return Array.from(graph.flat(this));
  }

  getError() {
    return {
      error: null,
      message: '',
      reason: 'none',
    };
  }

  getLabel() {
    return '';
  }

  getField(name) {
    return this.getFields()[name];
  }

  getFields() {
    return {};
  }

  getPackageJson() {
    return {};
  }

  getOriginal() {
    return this;
  }

  /**
   * @return {Stats}
   */
  getStats() {
    const stats = this.package ? this.package.stats : {};

    return {
      dependencyCount: 1,
      fileCount: Math.max(0, stats.fileCount || 0),
      unpackedSize: Math.max(0, stats.unpackedSize || 0),
    };
  }

  /**
   * @return {Stats}
   */
  getStatsRecursive() {
    const dependencies = this.flatChildren();

    if (!dependencies.includes(this)) {
      // If there is no cyclic dependencies, add itself
      dependencies.push(this);
    }

    const stats = {
      dependencyCount: -1, // don't count itself
      fileCount: 0,
      unpackedSize: 0,
    };

    dependencies.forEach((dep) => {
      const depStats = dep.getStats();
      stats.dependencyCount += depStats.dependencyCount;
      stats.fileCount += depStats.fileCount;
      stats.unpackedSize += depStats.unpackedSize;
    });

    return {
      dependencyCount: Math.max(0, stats.dependencyCount),
      fileCount: Math.max(0, stats.fileCount),
      unpackedSize: Math.max(0, stats.unpackedSize),
    };
  }

  isReal() {
    return false;
  }

  /**
   * @param {Dependency[]} children
   */
  loadChildren(children) {
    this.children = children;
  }

  /**
   * @return {Promise<void>}
   */
  async waitForResolve() {
    return null;
  }
}

Dependency.TYPES = ['normal', 'optional', 'peer', 'dev'];

module.exports = Dependency;
