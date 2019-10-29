'use strict';

const { formatSize } = require('./helpers');

/**
 * @implements Reporter
 */
class Default {
  /**
   * @param {ReporterOptions} options
   */
  constructor(options) {
    this.printer = options.printer;
  }

  /**
   * @param {Dependency} dependency
   */
  print(dependency) {
    const stats = dependency.getStatsRecursive();
    this.printer('Dependencies:', stats.dependencyCount);
    this.printer('Size:', formatSize(stats.unpackedSize));
    this.printer('Files:', stats.fileCount);
  }
}

module.exports = Default;
