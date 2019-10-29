'use strict';

const DuplicateDependency = require('./DuplicateDependency');

class UnmetDependency extends DuplicateDependency {
  getLabel() {
    return 'unmet';
  }

  getStats() {
    return {
      dependencyCount: 0,
      fileCount: 0,
      unpackedSize: 0,
    };
  }

  getOriginal() {
    return this;
  }
}

module.exports = UnmetDependency;
