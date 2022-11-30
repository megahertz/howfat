'use strict';

const { formatSize } = require('./helpers');

class Simple {
  /** @type {ReporterOptions} */
  options;

  /**
   * @param {ReporterOptions} options
   */
  constructor(options) {
    this.options = options;
    this.printer = options.printer;
    this.shortSize = options.shortSize !== false;
    this.useColors = options.useColors;
    if (this.useColors === undefined) {
      this.useColors = process.stdout.isTTY;
    }
  }

  /**
   * @param {Dependency} dependency
   */
  print(dependency) {
    const stats = dependency.getStatsRecursive();

    let size = stats.unpackedSize;
    if (this.shortSize) {
      size = formatSize(size);
    }

    this.printer('Dependencies:', stats.dependencyCount);
    this.printer('Size:', size);
    this.printer('Files:', stats.fileCount);
  }
}

module.exports = Simple;
