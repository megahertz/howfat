'use strict';

module.exports = {
  colorGray,
  formatSize,
  formatStats,

  getFieldNameByAlias(alias) {
    return FIELD_ALIASES[alias] || alias;
  },
};

const FIELD_ALIASES = {
  dependencies: 'dependencyCount',
  files: 'fileCount',
  size: 'unpackedSize',
};

const LABEL_MAP = {
  duplicate: '🔗',
  unmet: 'UNMET',
};

const COLORS = {
  gray: '\x1b[90m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
};

function formatSize(bytes) {
  if (bytes === 0) return '0b';
  const e = Math.floor(Math.log(bytes) / Math.log(1024));
  // eslint-disable-next-line no-restricted-properties
  return +(bytes / (1024 ** e)).toFixed(2)
    + 'bkmgtp'.charAt(e).replace('b', '') + 'b';
}

/**
 * @param {Dependency} dependency
 * @param {Required<ReporterOptions>} options
 * @return {string}
 */
function formatStats(dependency, options) {
  const stats = dependency.getStatsRecursive();
  const results = [];

  const error = dependency.getError();
  if (error.reason !== 'none') {
    results.push(colorRed(error.message, options.useColors));
  }

  const label = dependency.getLabel();
  if (label && LABEL_MAP[label]) {
    results.push(LABEL_MAP[label]);
  }

  options.fields
    .forEach((field) => {
      switch (field) {
        case 'dependencyCount': {
          if (stats.dependencyCount > 0) {
            const count = stats.dependencyCount;
            results.push(`${count} dep${count === 1 ? '' : 's'}`);
          }
          break;
        }

        case 'deprec': {
          const deprecated = dependency.getField('deprecated');
          if (deprecated) {
            let short = deprecated.slice(0, 35);
            if (short.length < deprecated.length) {
              short += '…';
            }
            results.push(
              colorRed(`⛔ ${short}`, options.useColors),
            );
          }
          break;
        }

        case 'deprecated': {
          const deprecated = dependency.getField('deprecated');
          if (deprecated) {
            results.push(
              colorRed(`Deprecated: ${deprecated}`, options.useColors),
            );
          }
          break;
        }

        case 'fileCount': {
          if (stats.fileCount > 0) {
            const count = stats.fileCount;
            results.push(`${count} file${count === 1 ? '' : 's'}`);
          }
          break;
        }

        case 'license': {
          if (dependency.getField('license') !== 'Unknown') {
            results.push(`©${dependency.getField('license')}`);
          }
          break;
        }

        case 'native': {
          if (isNativeDependency(dependency.getPackageJson())) {
            results.push(colorRed('NATIVE', options.useColors));
          }
          break;
        }

        case 'unpackedSize': {
          if (stats.unpackedSize > 0) {
            if (options.shortSize) {
              results.push(formatSize(stats.unpackedSize));
            } else {
              results.push(stats.unpackedSize);
            }
          }
          break;
        }

        default: {
          results.push(dependency.getField(field));
        }
      }
    });

  if (results.length < 1) {
    return '';
  }

  const resultsString = results
    .map((f) => f?.toString().trim())
    .filter(Boolean)
    .join(', ');

  return colorGray(` (${resultsString})`, options.useColors);
}

function colorGray(text, useColors) {
  if (!useColors) {
    return text;
  }

  return COLORS.gray + text + COLORS.reset;
}

function colorRed(text, useColors, endColor = COLORS.gray) {
  if (!useColors) {
    return text;
  }

  return COLORS.red + text + endColor;
}

/**
 * Return true if the package looks like a native dependency.
 *
 * Based on is-native-module and @electron/rebuild
 *
 * @param {object} packageJson
 * @return {boolean}
 */
function isNativeDependency(packageJson) {
  if (typeof packageJson !== 'object' || !packageJson) {
    return false;
  }

  const { dependencies = {}, devDependencies = {} } = packageJson;

  const checks = [
    dependencies.bindings,
    dependencies.nan,
    dependencies['node-gyp-build'],
    dependencies['node-pre-gyp'],
    dependencies.prebuild,
    dependencies['prebuild-install'],

    devDependencies.prebuildify,

    packageJson.binary,
    packageJson.gypfile,
  ];

  return checks.some(Boolean);
}
