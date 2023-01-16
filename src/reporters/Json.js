'use strict';

const BaseReporter = require('./BaseReporter');

class Json extends BaseReporter {
  /**
   * @param {Dependency} dependency
   */
  print(dependency) {
    if (dependency.isReal()) {
      this.printJson(this.serializeDependency(dependency));
      return;
    }

    const children = dependency.children;
    if (children.length === 1) {
      this.printJson(this.serializeDependency(children[0]));
      return;
    }

    this.printJson(
      children.map((c) => this.serializeDependency(c)),
    );
  }

  /**
   * @param {object} data
   * @private
   */
  printJson(data) {
    this.options.printer(JSON.stringify(data, null, this.options.space));
  }

  /**
   * @param {Dependency} dependency
   * @return {object}
   * @private
   */
  serializeDependency(dependency) {
    const stats = dependency.getStatsRecursive();
    const label = dependency.getLabel();
    const error = dependency.getError();

    return {
      package: dependency.toString(),
      dependencyCount: stats.dependencyCount,
      fileCount: stats.fileCount,
      unpackedSize: stats.unpackedSize,
      duplicate: label === 'duplicate',
      error: error.reason !== 'none' && error.message,
      unmet: label === 'unmet',
      ...dependency.getFields(),
      ownStats: dependency.getStats(),
      children: dependency.children.map(
        (child) => this.serializeDependency(child),
      ),
    };
  }
}

module.exports = Json;
