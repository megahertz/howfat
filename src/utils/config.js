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
          --fields STRING              Displayed fields separated by a comma:
                                       dependencies,size,files,license,
                                       author,description,maintainers,deprec,
                                       deprecated,native,node,os,platform
          --sort STRING                Sort field. Add minus sign for 
                                       desc order, like size-. Default to 'name'
          --space NUMBER               Use spaces in json output, default null
                                       
      -v, --verbose BOOLEAN            Show additional logs
          --no-colors BOOLEAN          Prevent color output
          --no-human-readable BOOLEAN  Show size in bytes
          
      --registry-url STRING            Default to https://registry.npmjs.org/
                                
      --http                           Node.js RequestOptions, like:
      --http.timeout NUMBER            Request timeout in ms, default 10000
      --http.connection-limit NUMBER   Max simultaneous connections, default 10
      --http.retry-count NUMBER        Try to fetch again of failure, default 5
      --http.proxy STRING              A proxy server url
      
      --show-config                    Show the current configuration
      --version                        Show howfat version
      --help                           Show this help
  `);

  return new Config(options);
}

class Config {
  /**
   * @param {PackageOptions} opts
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
      proxy: http.proxy || '',
      retryCount: http.retryCount || 5,
    };

    /**
     * @type {ReporterOptions}
     */
    this.reporterOptions = {
      name: opts.reporter || 'tree',
      fields: opts.fields || 'dependencies,size,files,native,license,deprec',
      shortSize: opts.humanReadable !== false,
      sort: opts.sort || 'name',
      space: opts.space || null,
      useColors: typeof opts.colors === 'boolean'
        ? opts.colors
        : process.stdout.isTTY,
    };

    this.registryUrl = opts.registryUrl || 'https://registry.npmjs.org/';

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
