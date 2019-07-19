#!/usr/bin/env node

'use strict';

const { buildDependencyGraphByName }     = require('./graph');
const createReporter                     = require('./reporters');
const { makeGetPkgMeta, makeGetPkgStat } = require('./utils');

main(process.argv[2]).catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main(pkg) {
  const meta = await buildDependencyGraphByName(
    pkg,
    '',
    {},
    makeGetPkgMeta(),
    makeGetPkgStat(),
    logDownload
  );

  const reporter = createReporter();
  reporter.print(meta);
  process.exit();
}

function logDownload(uri) {
  console.log('get', uri);
}
