'use strict';

const BaseReporter = require('./BaseReporter');
const { formatSize } = require('./helpers');

class Json extends BaseReporter {
  /**
   * @param {Dependency} dependency
   */
  print(dependency) {
    if (dependency.isReal()) {
      this.options.printer(JSON.stringify(this.draw(dependency)));
      return;
    }

    dependency.children.forEach((dep) => {
      this.options.printer(JSON.stringify(this.draw(dep)));
    });
  }

  /**
   * @param {Dependency} dependency
   * @param {Object} deps
   * @private
   */
  draw(dependency, deps = {}) {
    const stats = dependency.getStatsRecursive();
    const dependencies = dependency.children;
    const label = dependency.getLabel();

    deps[dependency.toString()] = {
      deps: stats.dependencyCount,
      size: formatSize(stats.unpackedSize),
      fileCount: stats.fileCount,
    };

    if (label) {
      if (label === 'duplicate') {
        deps[dependency.toString()].duplicate = true;
      } else if (label === 'unmet') {
        deps[dependency.toString()].unmet = 'UNMET';
      }
    }

    if (dependencies.length) {
      dependencies.forEach((dep) => {
        deps[dependency.toString()][dep.toString()] = {
          deps: stats.dependencyCount,
          size: formatSize(stats.unpackedSize),
          fileCount: stats.fileCount,
        };

        this.draw(dep, deps[dependency.toString()]);
      });
    }

    return deps;
  }
}

module.exports = Json;
