#!/usr/bin/env node

'use strict';

const { getDepsGraph } = require('./getDepsGraph');
const createReporter = require('./reporters');

main(process.argv[2]).catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main(pkg) {
  const meta = await getDepsGraph(pkg, null, { debug: true });
  const reporter = createReporter();
  reporter.print(meta);
  process.exit();
}
