'use strict';

const { test, expect } = require('humile');
const { runApp } = require('../runApp');

test('fetch-package-options', async () => {
  expect(await runApp({ args: 'package-options@0.1.4' })).toEqual([
    'package-options@0.1.4 (27.2kb, 12 files, ©MIT)',
  ]);
});
