'use strict';

const Default = require('./Simple');
const { formatStats } = require('./helpers');

const FIRST = 0;
const NORMAL = 1;
const LAST = 2;

class Tree extends Default {
  /**
   * @param {Dependency} dependency
   */
  print(dependency) {
    if (dependency.isReal()) {
      this.draw(dependency, '', FIRST);
      return;
    }

    dependency.children.forEach((dep, i, deps) => {
      this.draw(dep, '', FIRST);
      if (i < deps.length - 1) {
        this.printer('');
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

    this.printer(
      selfPrefix + dependency + formatStats(dependency, this.options),
    );

    dependencies.forEach((dep, i, deps) => {
      this.draw(dep, childPrefix, i >= deps.length - 1 ? LAST : NORMAL);
    });
  }
}

module.exports = Tree;
