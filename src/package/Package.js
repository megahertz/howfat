'use strict';

class Package {
  /** @type {string} */
  name;

  /** @type {string} */
  version;

  /** @type {string} */
  versionSpec;

  /** @type {Record<string, string>} */
  fields = {};

  /** @type {string} */
  localPath;

  dependencies = {
    dev: {},
    normal: {},
    optional: {},
    regular: {},
  };

  stats = {
    fileCount: -1,
    unpackedSize: -1,
  };

  requirements = {
    arch: undefined,
    platform: undefined,
  };

  error = {
    error: null,
    message: '',

    /** @type {'none' | 'not-found'} */
    reason: 'none',
  };

  /**
   * @param {string} name
   * @param {string} versionSpec
   */
  constructor(name, versionSpec) {
    this.name = name;
    this.versionSpec = versionSpec;
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

  setError({ error, message, reason }) {
    this.error = { error, message, reason };
  }

  toString() {
    return this.name + '@' + (this.version || this.versionSpec);
  }
}

module.exports = Package;
