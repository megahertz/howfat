'use strict';

const { formatSize } = require('./utils');

class Default {
  /**
   * @param {IOptions} options
   */
  constructor(options) {
    this.options = options;
  }

  /**
   * @param {BasicPackage} pkg
   */
  print(pkg) {
    const stats = pkg.getStats();
    console.log('Dependencies: ', stats.depCount);
    console.log('Size: ', formatSize(stats.unpackedSize));
    console.log('Files: ', stats.fileCount);
  }
}

module.exports = Default;
