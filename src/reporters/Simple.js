'use strict';

const { formatSize } = require('./helpers');
const BaseReporter = require('./BaseReporter');

class Simple extends BaseReporter {
  /**
   * @param {Dependency} dependency
   */
  print(dependency) {
    const stats = dependency.getStatsRecursive();

    let size = stats.unpackedSize;
    if (this.options.shortSize) {
      size = formatSize(size);
    }

    this.options.printer('Dependencies:', stats.dependencyCount);
    this.options.printer('Size:', size);
    this.options.printer('Files:', stats.fileCount);
  }
}

module.exports = Simple;
