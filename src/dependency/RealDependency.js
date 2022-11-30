'use strict';

const Dependency = require('./Dependency');

class RealDependency extends Dependency {
  /**
   * @param {DependencySpec} spec
   * @param {DependencyType} type
   */
  constructor(spec, type = 'normal') {
    super();

    this.spec = spec;
    this.type = type;

    /**
     * @type {Package}
     */
    this.package = null;

    this.includesDev = false;

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

  get name() {
    if (this.package) {
      return this.package.name;
    }

    return this.spec.name;
  }

  get version() {
    if (this.package) {
      return this.package.version;
    }

    return null;
  }

  canIncludeDevDependencies() {
    return this.includesDev;
  }

  /**
   * @param {boolean} value
   */
  setIncludesDevDependencies(value) {
    this.includesDev = value;
  }

  isReal() {
    return true;
  }

  /**
   * @param {Dependency[]} children
   */
  loadChildren(children) {
    super.loadChildren(children);
    this.onLoadDependencies.handler();
  }

  getError() {
    return this.package.error;
  }

  getFields() {
    return this.package?.fields || {};
  }

  /**
   * @param {Package} pkg
   */
  setPackage(pkg) {
    this.package = pkg;
  }

  toString() {
    return this.name + '@' + (this.version || this.spec.versionSpec);
  }

  /**
   * @return {Promise<void>}
   */
  async waitForResolve() {
    return this.onLoadDependencies.promise;
  }
}

module.exports = RealDependency;
