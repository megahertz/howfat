'use strict';

const { describe, expect, it } = require('humile');
const { createDependency } = require('../../__specs__');
const DependencyCache = require('../DependencyCache');

describe('DependencyCache', () => {
  it('stores and provides existed deps with specified version', async () => {
    const cache = new DependencyCache();

    const a1 = createDependency('a', '1.0.0');
    const a2 = createDependency('a', '2.0.0');

    cache.add(a1);
    cache.add(a2);

    expect(await cache.find({ name: 'a', versionSpec: '*' })).toBe(a2);
    expect(await cache.find({ name: 'a', versionSpec: '^1.0.0' })).toBe(a1);
    expect(await cache.find({ name: 'a', versionSpec: '^2.0.0' })).toBe(a2);
    expect(await cache.find({ name: 'a', versionSpec: '^3.0.0' })).toBeFalsy();
    expect(await cache.find({ name: 'b', versionSpec: '*' })).toBeFalsy();
  });
});
