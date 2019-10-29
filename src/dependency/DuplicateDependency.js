'use strict';

const RealDependency = require('./RealDependency');

class DuplicateDependency extends RealDependency {
  get version() {
    return this.original ? this.original.version : null;
  }

  getLabel() {
    return 'duplicate';
  }

  /**
   * @param {Dependency} dependency
   * @return {this}
   */
  setOriginal(dependency) {
    this.original = dependency;
    return this;
  }

  getOriginal() {
    return this.original || this;
  }

  getStats() {
    return this.original ? this.original.getStats() : super.getStats();
  }

  getStatsRecursive() {
    const original = this.original;
    return original ? original.getStatsRecursive() : super.getStatsRecursive();
  }
}

module.exports = DuplicateDependency;
