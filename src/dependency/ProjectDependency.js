'use strict';

const RealDependency = require('./RealDependency');

class ProjectDependency extends RealDependency {
  canIncludeDevDependencies() {
    return true;
  }

  setPackage(pkg) {
    this.package = pkg;
  }
}

module.exports = ProjectDependency;
