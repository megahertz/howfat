# howfat
[![Build Status](https://travis-ci.org/megahertz/howfat.svg?branch=master)](https://travis-ci.org/megahertz/howfat)
[![NPM version](https://badge.fury.io/js/howfat.svg)](https://badge.fury.io/js/howfat)

Shows how fat is a package together with its dependencies

![howfat](docs/screenshot.png)

## Why should I cate about my package size?

- Small package is installed much faster on CI
- Runs faster via `npx`
- Less dependencies = less troubles

## Usage

Just show package stats:

`npx howfat PACKAGENAME`

Show dependency tree stats:

`npx howfat PACKAGENAME -r tree`

Show stats of the current package:

```bash
cd MYPACKAGE
npx howfat
```

## Accuracy

Different package managers use different dependency resolution algorithms. Even
different versions of the same manager will resolve different dependency tree.
So this package tries to calculate stats similar to `npm`, but keep in mind that
it provides approximate results.
