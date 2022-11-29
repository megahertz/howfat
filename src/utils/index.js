'use strict';

const { getConfig } = require('./config');
const { createProgressIndicator } = require('./http/progress');

module.exports = {
  createProgressIndicator,
  getConfig,
};
