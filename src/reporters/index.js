'use strict';

const Default = require('./Default');

module.exports = createReporter;

/**
 *
 * @param {IOptions} options
 * @return {Default}
 */
function createReporter(options = {}) {
  const name = options && options.reporter;

  switch (name) {
    default: return new Default(options);
  }
}
