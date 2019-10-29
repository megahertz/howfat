'use strict';

const { formatSize } = require('./helpers');

const FIRST = 0;
const NORMAL = 1;
const LAST = 2;

const LABEL_MAP = {
  duplicate: '🔗',
  unmet: 'UNMET',
};

/**
 * @implements Reporter
 */
class Tree {
  /**
   * @param {ReporterOptions} options
   */
  constructor(options) {
    this.printer = options.printer;
    this.colors = options.colors;
    if (this.colors === undefined) {
      this.colors = process.stdout.isTTY;
    }
  }

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
   *
   * @param {Dependency} dependency
   * @param {string} prefix
   * @param {number} state
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

    this.printer(selfPrefix + dependency + this.getStats(dependency));

    dependencies.forEach((dep, i, deps) => {
      this.draw(dep, childPrefix, i >= deps.length - 1 ? LAST : NORMAL);
    });
  }

  /**
   * @param {Dependency} dependency
   * @return {string}
   */
  getStats(dependency) {
    const stats = dependency.getStatsRecursive();
    const results = [];
    const label = dependency.getLabel();

    if (label && LABEL_MAP[label]) {
      results.push(LABEL_MAP[label]);
    }

    if (stats.dependencyCount > 0) {
      const count = stats.dependencyCount;
      results.push(`${count} dep${count === 1 ? '' : 's'}`);
    }

    if (stats.unpackedSize > 0) {
      results.push(formatSize(stats.unpackedSize));
    }

    if (stats.fileCount > 0) {
      const count = stats.fileCount;
      results.push(`${count} file${count === 1 ? '' : 's'}`);
    }

    if (results.length < 1) {
      return '';
    }

    if (this.colors) {
      return colorGray(' (' + results.join(', ') + ')');
    }

    return ' (' + results.join(', ') + ')';
  }
}

function colorGray(text) {
  if (!process.stdout.isTTY) {
    return text;
  }

  return '\x1b[90m' + text + '\x1b[0m';
}

module.exports = Tree;
