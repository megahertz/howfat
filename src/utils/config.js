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
      
      --http                           Node.js RequestOptions, like:
      --http.timeout NUMBER            Request timeout in ms, default 10000
      --http.connection-limit NUMBER   Max simultaneous connections, default 10
      --http.retry-count NUMBER        Try to fetch again of failure, default 5
      
      --show-config                    Show the current configuration
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

    const http = opts.http || {};
    this.httpOptions = {
      ...http,
      connectionLimit: http.connectionLimit || 10,
      timeout: http.timeout || 10000,
      retryCount: http.retryCount || 5,
    };

    /**
     * @type {ReporterOptions}
     */
    this.reporterOptions = {
      name: opts.reporter || 'default',
      shortSize: opts.humanReadable !== false,
      useColors: opts.colors !== false,
    };

    this.isVerbose = opts.verbose || false;

    this.fetchedPackages = opts._;
    this.projectPath = opts._.length < 1 ? opts.getProjectPath() : undefined;

    this.helpText = opts.getHelpText();

    if (opts.showConfig) {
      console.info(this.toJSON()); // eslint-disable-line no-console
      process.exit();
    }
  }

  toJSON() {
    const config = { ...this };
    delete config.helpText;
    return config;
  }
}
