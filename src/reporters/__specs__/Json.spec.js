'use strict';

const { describe, expect, it } = require('humile');
const Json = require('../Json');
const { loadFixture } = require('../../__specs__');

describe('reporters/Json', () => {
  it('should print a complete json', async () => {
    const graph = await loadFixture('npm-package-arg');

    const jsonOutput = [];

    const json = new Json({
      printer: (text) => jsonOutput.push(text),
    });
    json.print(graph.getRoot());

    expect(jsonOutput[0]).toEqual('{"npm-package-arg@6.1.1":{"deps":7,"size":'
      + '"132.23kb","fileCount":47,"hosted-git-info@2.8.5":{"deps":0,'
      + '"size":"22.73kb","fileCount":7},"osenv@0.1.5":{"deps":2,'
      + '"size":"10.84kb","fileCount":12,"os-homedir@1.0.2":{"deps":0,'
      + '"size":"3.08kb","fileCount":4},"os-tmpdir@1.0.2":{"deps":0,'
      + '"size":"2.98kb","fileCount":4}},"semver@5.7.1":{"deps":0,'
      + '"size":"60.13kb","fileCount":7},"validate-npm-package-name@3.0.0":{'
      + '"deps":1,"size":"23.14kb","fileCount":16,"builtins@1.0.3":{"deps":0,'
      + '"size":"2.63kb","fileCount":7}}}}');
  });
});
