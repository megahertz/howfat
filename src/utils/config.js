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
      
      -r, --reporter STRING            'default', 'table', 'tree'
      -v, --verbose BOOLEAN            Show additional logs
          --no-colors BOOLEAN          Prevent color output
          --no-human-readable BOOLEAN  Show size in bytes 
      
      --connection-limit NUMBER        Max simultaneous connections, default 10
      --timeout NUMBER                 Request timeout in ms, default 10000
      --retry-count NUMBER             Try to fetch again of failure, default 5
      
      --version                        Show howfat version
      --help                           Show this help
  `);

  return new Config(options);
}

class Config {
  /**
   * @param {packageOptions.PackageOptions} opts
   */
  constructor(opts) {
    this.dependencyTypeFilter = {
      dev: opts.devDependencies === true,
      peer: opts.peerDependencies === true,
    };

    this.httpOptions = {
      connectionLimit: opts.connectionLimit || 10,
      timeout: opts.timeout || 10000,
      retryCount:  opts.retryCount || 5,
    };

    /**
     * @type {ReporterOptions}
     */
    this.reporterOptions = {
      name: opts.reporter,
      shortSize: opts.humanReadable !== false,
      useColors: opts.colors !== false,
    };

    this.isVerbose = opts.verbose;

    this.fetchedPackages = opts._;
    this.projectPath = opts._.length < 1 ? opts.getProjectPath() : undefined;

    this.helpText = opts.getHelpText();
  }
}
