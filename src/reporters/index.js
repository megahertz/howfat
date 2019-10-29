'use strict';

const Default = require('./Default');
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
    case 'tree': return new Tree(options);
    default: return new Default(options);
  }
}
