'use strict';

class Package {
  /**
   * @param {string} name
   * @param {string} versionSpec
   */
  constructor(name, versionSpec) {
    this.name = name;
    /**
     * @type {?string}
     */
    this.version = null;
    this.versionSpec = versionSpec;

    this.dependencies = {
      dev: {},
      normal: {},
      optional: {},
      regular: {},
    };

    this.stats = {
      fileCount: -1,
      unpackedSize: -1,
    };

    this.requirements = {
      arch: null,
      platform: null,
    };
  }

  /**
   * @param {DependencyTypeFilter} typeFilter
   * @return {{ normal: object, dev: object, peer: object, optional: object }}
   */
  getDependencies(typeFilter = {}) {
    const result = { normal: {}, optional: {}, peer: {}, dev: {} };
    const duplicates = {};

    typeFilter = typeFilter || {};
    typeFilter.dev = Boolean(typeFilter.dev);
    typeFilter.normal = typeFilter.normal !== false;
    typeFilter.optional = typeFilter.optional !== false;
    typeFilter.peer = Boolean(typeFilter.peer);

    for (const type of ['normal', 'optional', 'peer', 'dev']) {
      if (!typeFilter[type] || typeof this.dependencies[type] !== 'object') {
        continue;
      }

      for (const [name, spec] of Object.entries(this.dependencies[type])) {
        if (!duplicates[name]) {
          result[type][name] = spec;
          duplicates[name] = true;
        }
      }
    }

    return result;
  }

  hasStats() {
    return this.stats.fileCount > -1 && this.stats.unpackedSize > -1;
  }

  toString() {
    return this.name + '@' + (this.version || this.versionSpec);
  }
}

module.exports = Package;
