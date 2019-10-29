'use strict';

const { describe, expect, expectAsync, it } = require('humile');
const { createSimpleGraph } = require('../../__specs__');

describe('Dependency', () => {
  it('flatChildren', () => {
    const { root, a, b } = createSimpleGraph();
    expect(root.flatChildren()).toEqual([a, b]);
  });

  it('getStats', () => {
    const { root } = createSimpleGraph();

    expect(root.getStats()).toEqual({
      dependencyCount: 1,
      fileCount: 1,
      unpackedSize: 10,
    });
  });

  it('getStatsRecursive', () => {
    const { root, a, b } = createSimpleGraph();

    expect(a.getStatsRecursive()).toEqual({
      dependencyCount: 1,
      fileCount: 110,
      unpackedSize: 1100,
    });

    expect(b.getStatsRecursive()).toEqual({
      dependencyCount: 0,
      fileCount: 100,
      unpackedSize: 1000,
    });

    expect(root.getStatsRecursive()).toEqual({
      dependencyCount: 2,
      fileCount: 111,
      unpackedSize: 1110,
    });
  });

  it('waitForResolve', async () => {
    const { root, a } = createSimpleGraph();

    const promise = root.waitForResolve();

    root.loadChildren([a]);

    return expectAsync(promise).toBeResolved();
  });

});
