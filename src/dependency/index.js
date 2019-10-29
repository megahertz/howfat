'use strict';

const DependencyFactory = require('./DependencyFactory');

module.exports = {
  createDependencyFactory,
};

/**
 * @return {DependencyFactory}
 */
function createDependencyFactory() {
  return new DependencyFactory();
}
