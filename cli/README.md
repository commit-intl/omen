omen
====

all in one CLI for omen

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@omen/cli.svg)](https://npmjs.org/package/@omen/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@omen/cli.svg)](https://npmjs.org/package/omen)
[![License](https://img.shields.io/npm/l/@omen/cli.svg)](https://github.com/commit-intl/omen/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @omen/cli
$ omen COMMAND
running command...
$ omen (-v|--version|version)
@omen/cli/0.6.5 linux-x64 node-v10.14.1
$ omen --help [COMMAND]
USAGE
  $ omen COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`omen build`](#omen-build)
* [`omen export`](#omen-export)
* [`omen help [COMMAND]`](#omen-help-command)
* [`omen serve`](#omen-serve)

## `omen build`

build your app

```
USAGE
  $ omen build

OPTIONS
  -p, --prod  run in production mode

DESCRIPTION
  ...
```

_See code: [src/commands/build.js](https://github.com/commit-intl/omen/blob/v0.6.5/src/commands/build.js)_

## `omen export`

export pre-rendered pages by your ./src/pages.json

```
USAGE
  $ omen export

OPTIONS
  -f, --file=file  load pages from another file
  -p, --prod       run in production mode

DESCRIPTION
  ...
```

_See code: [src/commands/export.js](https://github.com/commit-intl/omen/blob/v0.6.5/src/commands/export.js)_

## `omen help [COMMAND]`

display help for omen

```
USAGE
  $ omen help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.4/src/commands/help.ts)_

## `omen serve`

start a dev server that renders your app

```
USAGE
  $ omen serve

OPTIONS
  -H, --host=host  start server on host
  -P, --port=port  start server on port
  -p, --prod       run in production mode

DESCRIPTION
  ...
```

_See code: [src/commands/serve.js](https://github.com/commit-intl/omen/blob/v0.6.5/src/commands/serve.js)_
<!-- commandsstop -->
