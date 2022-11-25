'use strict';

const { describe, expect, it } = require('humile');
const Tree = require('../Tree');
const { loadFixture } = require('../../__specs__');

describe('reporters/Tree', () => {
  it('should print a simple tree', async () => {
    const graph = await loadFixture('npm-package-arg');

    const lines = [];

    const tree = new Tree({
      printer: (text) => lines.push(text),
      useColors: false,
    });
    tree.print(graph.getRoot());

    expect(lines).toEqual([
      'npm-package-arg@6.1.1 (7 deps, 132.23kb, 47 files)',
      '├── hosted-git-info@2.8.5 (22.73kb, 7 files)',
      '├─┬ osenv@0.1.5 (2 deps, 10.84kb, 12 files)',
      '│ ├── os-homedir@1.0.2 (3.08kb, 4 files)',
      '│ ╰── os-tmpdir@1.0.2 (2.98kb, 4 files)',
      '├── semver@5.7.1 (60.13kb, 7 files)',
      '╰─┬ validate-npm-package-name@3.0.0 (1 dep, 23.14kb, 16 files)',
      '  ╰── builtins@1.0.3 (2.63kb, 7 files)',
    ]);
  });
});
