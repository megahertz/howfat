'use strict';

const { exec } = require('child_process');
const path = require('path');

module.exports = { runApp };

function runApp({ args, colors = false }) {
  const cmd = [
    'node',
    path.join(__dirname, '../src/index.js'),
    args,
    colors ? '' : '--no-colors',
  ].filter(Boolean).join(' ');

  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }

      const outputLines = stdout
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      resolve(outputLines);
    });
  });
}
