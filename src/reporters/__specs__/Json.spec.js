'use strict';

/* eslint-disable max-len */

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

    const outputJson = JSON.parse(jsonOutput[0]);

    expect(outputJson).toEqual({
      package: 'npm-package-arg@6.1.1',
      dependencyCount: 7,
      fileCount: 47,
      unpackedSize: 135406,
      duplicate: false,
      error: false,
      ownStats: {
        dependencyCount: 1,
        fileCount: 5,
        unpackedSize: 15759,
      },
      unmet: false,
      author: '{name:Isaac Z. Schlueter,email:i@izs.me,url:http://blog.izs.me/}',
      deprecated: '',
      description: 'Parse the things that can be arguments to `npm install`',
      license: 'ISC',
      maintainers: '[{email:ruyadorno@hotmail.com,name:ruyadorno},{email:mike@mikecorp.ca,name:mikemimik},{email:billatnpm@gmail.com,name:billatnpm},{email:anne@npmjs.com,name:annekimsey},{email:cghr1990@gmail.com,name:claudiahdz},{email:darcy@darcyclarke.me,name:darcyclarke},{email:evilpacket@gmail.com,name:adam_baldwin},{email:ahmad@ahmadnassri.com,name:ahmadnassri},{email:i@izs.me,name:isaacs}]',
      children: [
        {
          package: 'hosted-git-info@2.8.5',
          dependencyCount: 0,
          fileCount: 7,
          unpackedSize: 23278,
          duplicate: false,
          error: false,
          ownStats: {
            dependencyCount: 1,
            fileCount: 7,
            unpackedSize: 23278,
          },
          unmet: false,
          author: '{name:Rebecca Turner,email:me@re-becca.org,url:http://re-becca.org}',
          deprecated: '',
          description: 'Provides metadata and conversions from repository urls for Github, Bitbucket and Gitlab',
          license: 'ISC',
          maintainers: '[{email:evilpacket@gmail.com,name:adam_baldwin},{email:ahmad@ahmadnassri.com,name:ahmadnassri},{email:anne@npmjs.com,name:annekimsey},{email:billatnpm@gmail.com,name:billatnpm},{email:cghr1990@gmail.com,name:claudiahdz},{email:darcy@darcyclarke.me,name:darcyclarke},{email:i@izs.me,name:isaacs},{email:mike@mikecorp.ca,name:mikemimik},{email:ruyadorno@hotmail.com,name:ruyadorno}]',
          children: [],
        },
        {
          package: 'osenv@0.1.5',
          dependencyCount: 2,
          fileCount: 12,
          unpackedSize: 11097,
          duplicate: false,
          error: false,
          ownStats: {
            dependencyCount: 1,
            fileCount: 4,
            unpackedSize: 4889,
          },
          unmet: false,
          author: '{name:Isaac Z. Schlueter,email:i@izs.me,url:http://blog.izs.me/}',
          deprecated: '',
          description: 'Look up environment settings specific to different operating systems',
          license: 'ISC',
          maintainers: '[{email:ruyadorno@hotmail.com,name:ruyadorno},{email:mike@mikecorp.ca,name:mikemimik},{email:billatnpm@gmail.com,name:billatnpm},{email:anne@npmjs.com,name:annekimsey},{email:cghr1990@gmail.com,name:claudiahdz},{email:darcy@darcyclarke.me,name:darcyclarke},{email:evilpacket@gmail.com,name:adam_baldwin},{email:ahmad@ahmadnassri.com,name:ahmadnassri},{email:i@izs.me,name:isaacs}]',
          children: [
            {
              package: 'os-homedir@1.0.2',
              dependencyCount: 0,
              fileCount: 4,
              unpackedSize: 3152,
              duplicate: false,
              error: false,
              ownStats: {
                dependencyCount: 1,
                fileCount: 4,
                unpackedSize: 3152,
              },
              unmet: false,
              node: '>=0.10.0',
              author: '{name:Sindre Sorhus,email:sindresorhus@gmail.com,url:sindresorhus.com}',
              deprecated: '',
              description: 'Node.js 4 `os.homedir()` ponyfill',
              license: 'MIT',
              maintainers: '[{name:sindresorhus,email:sindresorhus@gmail.com}]',
              children: [],
            },
            {
              package: 'os-tmpdir@1.0.2',
              dependencyCount: 0,
              fileCount: 4,
              unpackedSize: 3056,
              duplicate: false,
              error: false,
              ownStats: {
                dependencyCount: 1,
                fileCount: 4,
                unpackedSize: 3056,
              },
              unmet: false,
              node: '>=0.10.0',
              author: '{name:Sindre Sorhus,email:sindresorhus@gmail.com,url:sindresorhus.com}',
              deprecated: '',
              description: 'Node.js os.tmpdir() ponyfill',
              license: 'MIT',
              maintainers: '[{name:sindresorhus,email:sindresorhus@gmail.com}]',
              children: [],
            },
          ],
        },
        {
          package: 'semver@5.7.1',
          dependencyCount: 0,
          fileCount: 7,
          unpackedSize: 61578,
          duplicate: false,
          error: false,
          ownStats: {
            dependencyCount: 1,
            fileCount: 7,
            unpackedSize: 61578,
          },
          unmet: false,
          author: '',
          deprecated: '',
          description: 'The semantic version parser used by npm.',
          license: 'ISC',
          maintainers: '[{email:ruyadorno@hotmail.com,name:ruyadorno},{email:mike@mikecorp.ca,name:mikemimik},{email:billatnpm@gmail.com,name:billatnpm},{email:anne@npmjs.com,name:annekimsey},{email:cghr1990@gmail.com,name:claudiahdz},{email:darcy@darcyclarke.me,name:darcyclarke},{email:evilpacket@gmail.com,name:adam_baldwin},{email:ahmad@ahmadnassri.com,name:ahmadnassri},{email:i@izs.me,name:isaacs}]',
          children: [],
        },
        {
          package: 'validate-npm-package-name@3.0.0',
          dependencyCount: 1,
          fileCount: 16,
          unpackedSize: 23694,
          duplicate: false,
          error: false,
          ownStats: {
            dependencyCount: 1,
            fileCount: 9,
            unpackedSize: 20998,
          },
          unmet: false,
          author: '{name:zeke}',
          deprecated: '',
          description: "Give me a string and I'll tell you if it's a valid npm package name",
          license: 'ISC',
          maintainers: '[{email:ruyadorno@hotmail.com,name:ruyadorno},{email:mike@mikecorp.ca,name:mikemimik},{email:billatnpm@gmail.com,name:billatnpm},{email:anne@npmjs.com,name:annekimsey},{email:cghr1990@gmail.com,name:claudiahdz},{email:darcy@darcyclarke.me,name:darcyclarke},{email:evilpacket@gmail.com,name:adam_baldwin},{email:ahmad@ahmadnassri.com,name:ahmadnassri},{email:i@izs.me,name:isaacs}]',
          children: [
            {
              package: 'builtins@1.0.3',
              dependencyCount: 0,
              fileCount: 7,
              unpackedSize: 2696,
              duplicate: false,
              error: false,
              ownStats: {
                dependencyCount: 1,
                fileCount: 7,
                unpackedSize: 2696,
              },
              unmet: false,
              author: '',
              deprecated: '',
              description: 'List of node.js builtin modules',
              license: 'MIT',
              maintainers: '[{email:julian@juliangruber.com,name:juliangruber},{email:tools+npm@segment.com,name:segment-admin}]',
              children: [],
            },
          ],
        },
      ],
    });
  });
});
