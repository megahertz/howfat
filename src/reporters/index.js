'use strict';

const Default = require('./Default');
const Table = require('./Table');
const Tree = require('./Tree');

module.exports = {
  createReporter,
};

/**
 * @param {string} name
 * @param {ReporterOptions} options
 * @return {Reporter}
 */
function createReporter(name, options = {}) {
  options = { printer: console.log, ...options };

  switch (name) {
    case 'table': return new Table(options);
    case 'tree': return new Tree(options);
    default: return new Default(options);
  }
}
