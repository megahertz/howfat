'use strict';

const BaseReporter = require('./BaseReporter');
const { formatStats } = require('./helpers');

const FIRST = 0;
const NORMAL = 1;
const LAST = 2;

class Tree extends BaseReporter {
  /**
   * @param {Dependency} dependency
   */
  print(dependency) {
    if (dependency.isReal()) {
      this.draw(dependency, '', FIRST);
      return;
    }

    dependency.children.sort(this.sortDependencies).forEach((dep, i, deps) => {
      this.draw(dep, '', FIRST);
      if (i < deps.length - 1) {
        this.options.printer('');
      }
    });
  }

  /**
   * @param {Dependency} dependency
   * @param {string} prefix
   * @param {number} state
   * @private
   */
  draw(dependency, prefix, state) {
    const dependencies = dependency.children;

    const nameChar = dependencies.length > 0 ? '┬' : '─';
    let selfPrefix = prefix + (state === LAST ? '╰─' : '├─') + nameChar + ' ';
    let childPrefix = prefix + (state === LAST ? '  ' : '│ ');

    if (state === FIRST) {
      selfPrefix = '';
      childPrefix = '';
    }

    this.options.printer(
      selfPrefix + dependency + formatStats(dependency, this.options),
    );

    dependencies.sort(this.sortDependencies).forEach((dep, i, deps) => {
      this.draw(dep, childPrefix, i >= deps.length - 1 ? LAST : NORMAL);
    });
  }

  /**
   * @param {Dependency} a
   * @param {Dependency} b
   */
  sortDependencies(a, b) {
    const sort = this.options.sort;

    if (['dependencyCount', 'fileCount', 'unpackedSize'].includes(sort)) {
      return super.sortDependencies(
        a.getStatsRecursive(),
        b.getStatsRecursive(),
      );
    }

    return super.sortDependencies(a, b);
  }
}

module.exports = Tree;
