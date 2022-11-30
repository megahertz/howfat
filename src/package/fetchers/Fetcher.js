'use strict';

class Fetcher {
  /**
   * @param {Package} _pkg
   * @param {DependencySpec} _dependencySpec
   * @return {Promise<Package>}
   */
  async fetch(_pkg, _dependencySpec) {
    throw new Error('Not implemented in base Fetcher');
  }

  /**
   * @param {object} packageJson
   * @return {{ dev: {}, normal: {}, peer: {}, optional: {} }}
   * @protected
   */
  extractDependencies(packageJson) {
    const defaults = { dev: {}, normal: {}, optional: {}, peer: {} };

    if (!packageJson) {
      return defaults;
    }

    return Object.keys(defaults).reduce((result, type) => {
      const key = type === 'normal' ? 'dependencies' : type + 'Dependencies';
      const deps = packageJson[key];
      if (typeof deps !== 'object') {
        return result;
      }

      result[type] = deps;

      return result;
    }, defaults);
  }

  /**
   * @param {object} packageJson
   * @return {{ arch: ?string, node: ?string, platform: ?string }}
   * @protected
   */
  extractRequirements(packageJson) {
    return {
      arch: packageJson?.cpu,
      node: packageJson?.engines?.node,
      platform: packageJson.os,
    };
  }
}

module.exports = Fetcher;
