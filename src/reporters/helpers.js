'use strict';

module.exports = {
  colorGray,
  formatSize,
  formatStats,
};

const LABEL_MAP = {
  duplicate: '🔗',
  unmet: 'UNMET',
};

function formatSize(bytes) {
  if (bytes === 0) return '0b';
  const e = Math.floor(Math.log(bytes) / Math.log(1024));
  // eslint-disable-next-line no-restricted-properties
  return +(bytes / (Math.pow(1024, e))).toFixed(2)
    + 'bkmgtp'.charAt(e).replace('b', '') + 'b';
}

/**
 * @param {Dependency} dependency
 * @param {object} options
 * @param {boolean} options.shortSize
 * @param {boolean} options.useColors
 * @return {string}
 */
function formatStats(dependency, options) {
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
    if (options.shortSize) {
      results.push(formatSize(stats.unpackedSize));
    } else {
      results.push(stats.unpackedSize);
    }
  }

  if (stats.fileCount > 0) {
    const count = stats.fileCount;
    results.push(`${count} file${count === 1 ? '' : 's'}`);
  }

  if (results.length < 1) {
    return '';
  }

  return colorGray(' (' + results.join(', ') + ')', options.useColors);
}

function colorGray(text, useColors = process.stdout.isTTY) {
  if (!useColors) {
    return text;
  }

  return '\x1b[90m' + text + '\x1b[0m';
}
