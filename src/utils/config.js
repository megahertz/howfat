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
      -d, --dev-dependencies BOOLEAN   Fetch dev dependencies, default false
      -p, --peer-dependencies BOOLEAN  Fetch peer dependencies, default false
      
      -r, --reporter STRING            'default', 'tree'
      -v, --verbose BOOLEAN            Show additional logs
      
      --connection-limit NUMBER        Max simultaneous connections, default 10
      --timeout NUMBER                 Request timeout in ms, default 10000
      --retry-count NUMBER             Try to fetch again of failure, default 5
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
    this.projectPath = opts._.length < 1 ? opts.getProjectPath() : undefined;

    this.helpText = opts.getHelpText();
  }
}
