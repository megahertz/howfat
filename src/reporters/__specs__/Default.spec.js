'use strict';

const { describe, expect, it } = require('humile');
const Default = require('../Default');
const { loadFixture } = require('../../__specs__');

describe('reporters/Default', () => {
  it('should print simple stats', async () => {
    const graph = await loadFixture('npm-package-arg');
    const lines = [];
    const tree = new Default({
      printer(...text) {
        lines.push(text.join(' '));
      },
    });

    tree.print(graph.getRoot());

    expect(lines).toEqual([
      'Dependencies: 7',
      'Size: 132.23kb',
      'Files: 47',
    ]);
  });
});
