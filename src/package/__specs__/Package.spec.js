'use strict';

const { describe, expect, it } = require('humile');
const Package = require('../Package');

describe('Package', () => {
  describe('getDependencies', () => {
    const pkg = new Package('test', '^1.0.0');

    pkg.dependencies = {
      normal: {
        'lighter-config': '>=1.1.0 <2',
        'fsevents': '>=1.0.14 <2',
      },
      optional: {
        debug: '^1.0.0',
        fsevents: '>=1.0.14 <2',
      },
    };

    it('removes duplicates', () => {
      expect(pkg.getDependencies()).toEqual({
        dev: {},
        normal: {
          'lighter-config': '>=1.1.0 <2',
          'fsevents': '>=1.0.14 <2',
        },
        optional: {
          debug: '^1.0.0',
        },
        peer: {},
      });
    });

    it('filter dependencies', () => {
      expect(pkg.getDependencies({ optional: false })).toEqual({
        dev: {},
        normal: {
          'lighter-config': '>=1.1.0 <2',
          'fsevents': '>=1.0.14 <2',
        },
        optional: {},
        peer: {},
      });
    });
  });
});
