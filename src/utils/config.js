'use strict';

const options = require('package-options');

module.exports = {
  getConfig,
};

/**
 * @return {Config}
 */
function getConfig() {
  options.help(`
    Usage: howfat [package1] [packageN] [OPTIONS]
    Options:
      --connection-limit NUMBER
      --timeout NUMBER         
      --retry-count NUMBER
      
      -d, --dev-dependencies BOOLEAN
      -p, --peer-dependencies BOOLEAN
      
      -r, --reporter STRING
      
      -v, --verbose BOOLEAN
  `);

  return new Config(options);
}

class Config {
  /**
   * @param {packageOptions.PackageOptions} opts
   */
  constructor(opts) {
    this.connectionLimit = opts.connectionLimit || 10;
    this.timeout = opts.timeout || 10000;
    this.retryCount = opts.retryCount || 5;

    this.dependencyTypeFilter = {
      dev: opts.devDependencies === true,
      peer: opts.peerDependencies === true,
    };

    this.reporter = opts.reporter;
    this.isVerbose = opts.verbose;

    this.fetchedPackages = opts._;

    this.projectPath = opts._.length < 1 ? opts.getProjectPath() : null;
  }
}
