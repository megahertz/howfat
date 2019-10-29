'use strict';

const Dependency = require('./Dependency');

class GroupDependency extends Dependency {
  /**
   * @param {Dependency} dependency
   * @return {this}
   */
  addDependency(dependency) {
    this.children.push(dependency);
  }

  getStats() {
    return {
      dependencyCount: 1 - this.children.length,
      fileCount: 0,
      unpackedSize: 0,
    };
  }
}

module.exports = GroupDependency;
