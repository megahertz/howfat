'use strict';

module.exports = {
  formatSize,
};

function formatSize(bytes) {
  if (bytes === 0) return '0b';
  const e = Math.floor(Math.log(bytes) / Math.log(1024));
  // eslint-disable-next-line no-restricted-properties
  return +(bytes / (Math.pow(1024, e))).toFixed(2)
    + 'bkmgtp'.charAt(e).replace('b', '') + 'b';
}
