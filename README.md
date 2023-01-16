# howfat
[![Tests](https://github.com/megahertz/howfat/actions/workflows/tests.yml/badge.svg)](https://github.com/megahertz/howfat/actions/workflows/tests.yml)
[![NPM version](https://badge.fury.io/js/howfat.svg)](https://badge.fury.io/js/howfat)

Shows how fat is a package together with its dependencies

![howfat](docs/screenshot.png)

## Usage

### Simple

`npx howfat mkdirp`

Specified version or version range:

`npx howfat mkdirp@^0.5.0`

Local packages

```bash
cd my-project
npx howfat
```

`npx howfat ../my-other-package`

Git or github

`npx howfat https://github.com/substack/node-mkdirp`

`npx howfat ssh://git@github.com:substack/node-mkdirp.git#0.3.4`

### Different reporters

Just show a simple stats:

```
$ npx howfat -r simple mkdirp@0.5.1
Dependencies: 1
Size: 41.49kb
Files: 37
```

as a table:

```
$ npx howfat -r table mkdirp@0.5.1
mkdirp@0.5.1 (1 dep, 41.49kb, 37 files)
╭────────────────┬──────────────┬─────────┬───────╮
│ Name           │ Dependencies │    Size │ Files │
├────────────────┼──────────────┼─────────┼───────┤
│ minimist@0.0.8 │            0 │ 20.78kb │    14 │
╰────────────────┴──────────────┴─────────┴───────╯
```

as a json:

`$ npx howfat -r json mkdirp@0.5.1 --space 2`
```json
{
  "package": "mkdirp@0.5.1",
  "dependencyCount": 1,
  "fileCount": 37,
  "unpackedSize": 42486,
  "duplicate": false,
  "error": false,
  "unmet": false,
  "author": "{name:James Halliday,email:mail@substack.net,url:http://substack.net}",
  "deprecated": "Legacy versions of mkdirp are no longer supported. Please update to mkdirp 1.x. (Note that the API surface has changed to use Promises in 1.x.)",
  "description": "Recursively mkdir, like `mkdir -p`",
  "license": "MIT",
  "maintainers": "[{name:isaacs,email:i@izs.me}]",
  "ownStats": {
    "dependencyCount": 1,
    "fileCount": 23,
    "unpackedSize": 21212
  },
  "children": [
    {
      "package": "minimist@0.0.8",
      "dependencyCount": 0,
      "fileCount": 14,
      "unpackedSize": 21274,
      "duplicate": false,
      "error": false,
      "unmet": false,
      "author": "{name:James Halliday,email:mail@substack.net,url:http://substack.net}",
      "deprecated": "",
      "description": "parse argument options",
      "license": "MIT",
      "maintainers": "[{email:ljharb@gmail.com,name:ljharb},{email:github@tixz.dk,name:emilbayes}]",
      "ownStats": {
        "dependencyCount": 1,
        "fileCount": 14,
        "unpackedSize": 21274
      },
      "children": []
    }
  ]
}
```

### Other options

```
  -d, --dev-dependencies BOOLEAN   Fetch dev dependencies, default false
  -p, --peer-dependencies BOOLEAN  Fetch peer dependencies, default false
  
  -r, --reporter STRING            'default', 'table', 'tree'
      --fields STRING              Displayed fields separated by a comma:
                                   dependencies,size,files,license,
                                   author,description,maintainers,deprec,
                                   deprecated,node,os,platform
      --sort STRING                Sort field. Add minus sign for 
                                   desc order, like size-. Default to 'name'
      --space NUMBER               Use spaces in json output, default null
                                   
  -v, --verbose BOOLEAN            Show additional logs
      --no-colors BOOLEAN          Prevent color output
      --no-human-readable BOOLEAN  Show size in bytes
      
  --registry-url STRING            Default to https://registry.npmjs.org/
                            
  --http                           Node.js RequestOptions, like:
  --http.timeout NUMBER            Request timeout in ms, default 10000
  --http.connection-limit NUMBER   Max simultaneous connections, default 10
  --http.retry-count NUMBER        Try to fetch again of failure, default 5
  --http.proxy STRING              A proxy server url
  
  --show-config                    Show the current configuration
  --version                        Show howfat version
  --help                           Show this help
```

## Accuracy

Different package managers use different dependency resolution algorithms. Even
different versions of the same manager will resolve different dependency tree.
So, this package tries to calculate stats similar to `npm`, but keep in mind that
it provides approximate results.

## Why should I care about my package size?

- Small package is installed much faster on CI
- Runs faster via `npx`
- Less dependencies = less troubles
