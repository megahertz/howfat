'use strict';

const { describe, expect, it } = require('humile');
const { loadFixture } = require('../../__specs__');
const DuplicateDependency = require('../../dependency/DuplicateDependency');


describe('DependencyResolver', () => {
  it('parses @webassemblyjs/helper-code-frame correctly', async () => {
    const graph = await loadFixture('@webassemblyjs/helper-code-frame');

    expect(graph.getRoot().getStatsRecursive()).toEqual({
      dependencyCount: 10,
      unpackedSize: 691071,
      fileCount: 96,
    });
  });


  it('should detect duplicated dependencies', async () => {
    const graph = await loadFixture('@webassemblyjs/helper-code-frame');

    const node = graph.getNode([
      '@webassemblyjs/wast-printer', '@webassemblyjs/wast-parser', '@xtuc/long',
    ]);

    expect(node.constructor).toBe(DuplicateDependency);
  });

  it('should detect unmet dependencies', async () => {
    const graph = await loadFixture('lighter-run');

    const children = graph.getFixtureRoot().children;

    expect(children.length).toEqual(2);
  });
});
