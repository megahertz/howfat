#!/usr/bin/env node

'use strict';

const { buildDependencyGraphByName } = require('./graph');
const createReporter                   = require('./reporters');

main(process.argv[2]).catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main(pkg) {
  const meta = await buildDependencyGraphByName(pkg, '', { debug: true });
  const reporter = createReporter();
  reporter.print(meta);
  process.exit();
}
