'use strict';

const { getFieldNameByAlias } = require('./helpers');

class BaseReporter {
  /** @type {Required<ReporterOptions> & { sortAsc: boolean }} */
  options;

  /**
   * @param {ReporterOptions} options
   */
  constructor(options) {
    this.options = this.normalizeOptions(options);
    this.sortDependencies = this.sortDependencies.bind(this);
  }

  /**
   * @param {Dependency} _dependency
   * @abstract
   */
  print(_dependency) {
    // Not implemented
  }

  /**
   * @param {ReporterOptions} options
   * @return {Required<ReporterOptions> & { sortAsc: boolean }}}
   */
  normalizeOptions(options) {
    const sort = options.sort || 'size-';

    const fields = (options.fields || 'dependencies,size,files,license')
      .split(',')
      .map((f) => f?.trim())
      .filter(Boolean)
      .map((f) => getFieldNameByAlias(f));

    return {
      fields,
      printer: options.printer,
      shortSize: options.shortSize !== false,
      sort: getFieldNameByAlias(sort.replace(/[-+]$/, '')),
      sortDesc: sort.endsWith('-'),
      useColors: options.useColors,
    };
  }

  /**
   * @param {object} a
   * @param {object} b
   */
  sortDependencies(a, b) {
    const sort = this.options.sort;

    const aVal = a[sort];
    const bVal = b[sort];

    // eslint-disable-next-line no-restricted-globals
    const isNumeric = !isNaN(aVal) && !isNaN(bVal);

    let diff = 0;
    if (isNumeric) {
      diff = aVal - bVal;
    } if (typeof aVal === 'string' && typeof bVal === 'string') {
      diff = aVal.localeCompare(bVal);
    }

    return this.options.sortDesc ? -diff : diff;
  }
}

module.exports = BaseReporter;
