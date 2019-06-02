'use strict';

const { describe, expect, it } = require('humile');

const DependencyCache = require('../DependencyCache');
const packageFactory  = require('../package');

describe('DependencyCache', () => {
  it('should store and provide dependencies which satisfies specs', () => {
    const cache = new DependencyCache();
    const a1 = packageFactory('a', '1.0.0');
    a1.version = '1.0.0';
    const a2 = packageFactory('a', '2.0.0');
    a2.version = '2.0.0';

    cache.add(a1);
    cache.add(a2);

    expect(cache.find('a', '*')).toBe(a2);
    expect(cache.find('a', '^1.0.0')).toBe(a1);
    expect(cache.find('a', '^2.0.0')).toBe(a2);
    expect(cache.find('a', '^3.0.0')).toBeFalsy();
  });
});
