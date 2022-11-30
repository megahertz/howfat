'use strict';

const Simple = require('./Simple');
const Table = require('./Table');
const Tree = require('./Tree');

module.exports = {
  createReporter,
};

/**
 * @param {ReporterOptions} options
 * @return {Simple}
 */
function createReporter(options = {}) {
  // eslint-disable-next-line no-console
  options = { printer: console.info, ...options };

  switch (options.name) {
    case 'simple': return new Simple(options);
    case 'table': return new Table(options);
    default: return new Tree(options);
  }
}
