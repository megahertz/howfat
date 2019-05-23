'use strict';

class Default {
  /**
   * @param {IOptions} options
   */
  constructor(options) {
    this.options = options;
  }

  /**
   * @param {Meta} meta
   */
  print(meta) {
    const stats = meta.getStats();
    console.log('Dependencies: ', stats.depCount);
    console.log('Size: ', stats.unpackedSize);
    console.log('Files: ', stats.fileCount);
  }
}

module.exports = Default;
