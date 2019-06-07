'use strict';

const path = require('path');

module.exports = {
  getFixtureName(packageName) {
    return decodeURIComponent(packageName)
      .replace('@', '')
      .replace('/', '_');
  },
};
