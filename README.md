# Vue auto-import checker

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) [![npm version](https://img.shields.io/npm/v/vue-auto-import-checker.svg)](https://www.npmjs.com/package/vue-auto-import-checker) [![npm downloads](https://img.shields.io/npm/dm/vue-auto-import-checker.svg)](https://www.npmjs.com/package/vue-auto-import-checker)

<!-- TOC -->
* [Description](#description)
* [Requirements](#requirements)
* [Installation](#installation)
* [CLI-Options](#cli-options)
* [Usage](#usage)
* [Examples](#examples)
* [CI/CD Integration](#cicd-integration)
* [Security](#security)
* [Feedback & Contributions](#feedback--contributions)
<!-- TOC -->

## Description

A CLI tool that checks whether every non-HTML tag used in your Vue templates is properly registered in `components.d.ts`
when using unplugin-vue-components (or similar auto-import setups).

You can configure which tag-sets the checker should ignore. `HTML`, `Vue`, `VueRouter` and `SVG` tags are ignored by default.

You can also use the importer tools to use your own list of tags, currently only for `vuetify` (currently v3.8.3)* and
`VueUse` (currently v13.5.0)*.

\*See the *[Usage](#usage)* section for more `vuetify` & `VueUse` related information.

## Requirements

We recommend using:

- Node.js >= 23.5.0

\*See the *[Usage](#usage)* section for a workaround on Node.js <= 23.4.0.

## Installation

``` bash
 npm i vue-auto-import-checker
```

## CLI Options

| Option                              | Alias | Description                                          | Default             |
|-------------------------------------|-------|------------------------------------------------------|---------------------|
| `--components-file <file>`          | `-c`  | Path to the `components.d.ts` file (relative to CWD) | `./components.d.ts` |
| `--project-path <path>`             | `-p`  | Path to the Vue source directory (relative to CWD)   | `""`                |
| `--stats`                           | `-s`  | Print a summary of the check                         | `false`             |
| `--result`                          | `-r`  | Print detailed results                               | `false`             |
| `--quiet`                           | `-q`  | Suppress all output                                  | `false`             |
| `--customtags [customtags...]`      | —     | Ignore these tags                                    | `[]`                |
| `--customtagsfile <customtagsfile>` | —     | Ignore tags listed in this json file                 | `""`                |
| `--vuetify`                         | —     | Ignore Vuetify tags                                  | `false`             |
| `--vueuse`                          | —     | Ignore VueUse tags                                   | `false`             |
| `--novue`                           | —     | Do not ignore Vue tags                               | `false`             |
| `--novuerouter`                     | —     | Do not ignore VueRouter tags                         | `false`             |
| `--nosvg`                           | —     | Do not ignore svg element tags                       | `false`             |
| `--nohtml`                          | —     | Do not ignore HTML element tags                      | `false`             |
| `--tool <tool>`                     | `-t`  | use a tool to customize your checker                 | `""`                |
| `--version`                         | `-v`  | Show the currently installed version                 | —                   |
| `--help`                            | `-h`  | Display help information                             | —                   |


## Usage

``` bash
 npx vue-auto-import-checker -h
```

### Vuetify >= 3.8.4

We provide a list of vuetify tags from version `3.8.3` out of the box.

But you can import your own set of tags by using the `vuetify-importer` tool.

``` bash
 npx vue-auto-import-checker -t vuetify-importer
```

This will add a new vuetify tag-list from your actual vuetify implementation, so that the checker ignores all vuetify
tags from your current vuetify version. (tested with vuetify v3.8.3 and v3.11.1)

This will add a folder (.cache) to your node_modules folder.

Try to use other versions and [report](https://github.com/marcelwagner/vue-auto-import-checker/issues/10), for which version the importer works.

### VueUse >= 13.5.0

We provide a list of VueUse tags from version `13.5.0` out of the box.

But you can import your own set of tags by using the `vueuse-importer` tool.

``` bash
 npx vue-auto-import-checker -t vueuse-importer
```

This will add a new vueUse tag-list from your actual vueUse implementation, so that the checker ignores all vueUse tags
from your current vueUse version. (tested with @vueuse/components v13.5.0 and v14.0.0)

This will add a folder (.cache) to your node_modules folder.

Try to use other versions and [report](https://github.com/marcelwagner/vue-auto-import-checker/issues/11), for which version the importer works.

### Node.js <= 23.4.0

If you're running **Node.js <= 23.4.0**, you can use:

``` bash
 tsx cli.ts -h
```

Tested with Node.js v22.18.1

Try to use other versions and [report](https://github.com/marcelwagner/vue-auto-import-checker/issues/9), for which version the cli works.

## Examples

### 1. Assumption

- Your `components.d.ts` file lives at: \
  `./tests/data/vue-test-project/components.d.ts`
- Vue component files are located in: \
  `./tests/data/vue-test-project/src/`
- You are using Vuetify and a custom component named `ToolingIcon`
- And you want to see a report and a statistical output

``` bash
 npx vue-auto-import-checker \
  -c ./tests/data/vue-test-project/components.d.ts \
  -p ./tests/data/vue-test-project/src/ \
  --vuetify \
  --customtags ToolingIcon EcosystemIcon \
  -r \
  -s
```

or

### 2. Assumption

- Your `components.d.ts` file lives at: \
  `./tests/data/vue-test-project/components.d.ts`
- Vue component files are located in: \
  `./tests/data/vue-test-project/src/`
- You are using Vuetify and a custom component named `ToolingIcon`
- And you only want to have this tool in your CI workflow to fail or pass

``` bash
 npx vue-auto-import-checker \
  -c ./tests/data/vue-test-project/components.d.ts \
  -p ./tests/data/vue-test-project/src/ \
  --vuetify \
  --customtags ToolingIcon EcosystemIcon
```

or

### 3. Assumption

- Your `components.d.ts` file lives at: \
  `./tests/data/vue-test-project/components.d.ts`
- And you only want a list of all tags the components.d.ts file is providing

``` bash
 npx vue-auto-import-checker -c ./tests/data/vue-test-project/components.d.ts
```

## CI/CD Integration

This tool is CI-friendly

- If unknown tags are detected, the CLI will exit with a non-zero status code
- If no issues are found, it will exit successfully with code `0`

This allows you to easily break builds when auto-imports are missing.

## Security

The tool will need some read and write permissions on your local hard disc.

To use the tool without any custom file (vuetify, vueUse, customTagFile), the tool needs:

  - `read`-permission to the files and folders of `project-path`
  - `read`-permission for the `components-file`-path

If you want to use a customTagFile, the tool needs additionally:

  - `read`-permission for the `customtagsfile`-path

If you want to use custom vuetify or VueUse tag-lists, the tool needs additionally:

  - `read`-permission for the `node_modules`-path and its subfolders
  - `write`-permission for the `node_modules`-path and its subfolders
  - `read`-permission for the `node_modules`-path and the subfolders
  
The tool will add a folder `.cache` as a subfolder to the `node_modules`-folder for your custom vuetify or VueUse tag-lists.


## Feedback & Contributions

If this tool helps you out, consider leaving a star on the repository — it really motivates further development!

Found a bug? Something not working as expected?  
Please open an issue on so it can be fixed quickly.

Missing a feature you’d love to see?  
Feature requests are very welcome as well!

[![GitHub](https://img.shields.io/badge/GitHub-Repo-blue?logo=github)](https://github.com/marcelwagner/vue-auto-import-checker)

Thanks for helping make **Vue Auto-Import Checker** better for everyone! 🙌