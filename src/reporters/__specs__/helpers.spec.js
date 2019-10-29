'use strict';

const { describe, expect, it } = require('humile');
const helpers = require('../helpers');

describe('utils/helpers', () => {
  it('formatSize', () => {
    expect(helpers.formatSize(250)).toBe('250b');
    expect(helpers.formatSize(1024)).toBe('1kb');
    expect(helpers.formatSize(1500)).toBe('1.46kb');
    expect(helpers.formatSize(1500000)).toBe('1.43mb');
  });
});
