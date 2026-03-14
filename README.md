# Vue auto-import checker

npm: [vue-auto-import-checker](https://www.npmjs.com/package/vue-auto-import-checker)

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) [![npm version](https://img.shields.io/npm/v/vue-auto-import-checker.svg)](https://www.npmjs.com/package/vue-auto-import-checker) [![npm downloads](https://img.shields.io/npm/dm/vue-auto-import-checker.svg)](https://www.npmjs.com/package/vue-auto-import-checker)

<!-- TOC -->
* [Description](#description)
* [Why?](#why)
* [Requirements](#requirements)
* [Installation](#installation)
* [Usage](#usage)
* [CLI Options](#cli-options)
* [Known Framework tags](#known-framework-tags)
* [Examples](#examples)
* [CI/CD Integration](#cicd-integration)
* [Security](#security)
* [Importers](#importers)
* [Contributors](#contributors)
* [Feedback & Contributions](#feedback--contributions)
<!-- TOC -->

## Description

A CLI tool that checks if every tag used in your Vue templates is either properly registered in `components.d.ts`
when using [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) (or similar auto-import setups), 
is a tag from a standard library like `HTML`, `SVG`, `Vue`, or `VueRouter`, or a tag from a framework like `Vuetify` or `Nuxt`.

You can configure which tag sets the checker should handle as if they were known. `HTML`, `Vue`, `VueRouter`, and `SVG` 
tags are known by default, but you can remove them from the known list if needed.

To have a framework on the known list, you only need to provide its name. Look up what we support at the moment (Nuxt, 
PrimeVue, Vuetify, ...) in the section [Known Framework tags](#known-framework-tags).

It is also possible to provide your own list of known tags by providing a `custom-tags-file` in JSON format or a simple list 
of tags.

You can also use the importer tools to use your own list of tags for `Vuetify`, `VueUse`, `Quasar`, `Nuxt`, `Naive UI`, 
and `PrimeVue` if your version is not yet supported by the tool.

## Why?

Why does this tool exist?  

Because of migration from older codebases and toolsets to modern ones.  

My experience as a developer showed me that the decision to use the top end toolset does come one day and then the 
migration is oftentimes not a recommendation from the customer, but from the developer team. That means the migration
is not paid work. So it is not made as a priority.   
Using something like the unplugin for your vue project is 
recommended. But the migration is not always easy. You have to change your codebase, and you have to make sure that you 
do not forget any tags. This tool helps you with that. It checks your codebase for unknown tags and tells you where 
they are. So you can easily find and fix them.

## Requirements

We recommend using:

- Node.js >= 24.11.1 (minimum required 20.19.1)

Other versions might work but are not tested.

## Installation

``` bash
 npm i vue-auto-import-checker
```

## Usage

The help of the CLI tool is a good starting point, but you can also start with an example from our [examples](#examples).

``` bash
 npx vue-auto-import-checker -h
```

## CLI Options

| Option                          | Alias | Description                                                                                                 | Default                   |
|---------------------------------|-------|-------------------------------------------------------------------------------------------------------------|---------------------------|
| `--components-file <file-path>` | `-c`  | Path to a file exporting registered components (relative to current working directory)                      | `""`                      |
| `--project-path <project-path>` | `-p`  | Directory path containing Vue project files to scan (relative to current working directory)                 | `""`                      |
| `--cache-path <cache-path>`     | `-a`  | Directory for storing and looking up cached/custom known files (relative to current working directory)      | `"./node_modules/.cache"` |
| `--tool <tool>`                 | `-t`  | Run a specific helper tool (e.g., Nuxt, PrimeVue, Quasar, VueUse, Vuetify) to generate customized tag lists | `""`                      |
| `--stats`                       | `-s`  | Output aggregated scan statistics                                                                           | `false`                   |
| `--result`                      | `-r`  | Output detailed result entries for each found component                                                     | `false`                   |
| `--quiet`                       | `-q`  | Suppress all standard output                                                                                | `false`                   |
| `--known-tags [tags...]`        | `-l`  | List of custom component tags to treat as known                                                             | `[]`                      |
| `--known-tags-file <file-path>` | `-j`  | Path to a JSON file containing a list of component tags to treat as known                                   | `""`                      |
| `--frameworks [frameworks...]`  | `-f`  | Predefined framework tag sets (e.g., Vuetify, VueUse, Quasar, Nuxt, Naive UI, PrimeVue) as known            | `[]`                      |
| `--negate-known [sets...]`      | `-n`  | Explicitly treat tag sets as known (e.g., HTML, SVG, Vue, VueRouter)                                        | `[]`                      |
| `--kafka`                       | `-k`  | Output each found tag with its framework and whether it is recognized                                       | `false`                   |
| `--debug`                       | `-d`  | Enable detailed debug logging                                                                               | `false`                   |
| `--imports-known`               | `-i`  | Treat tags matching imported components as known                                                            | `false`                   |
| `--version`                     | `-v`  | Output the current version                                                                                  | `false`                   |
| `--help`                        | `-h`  | Display help information                                                                                    | `false`                   |

## Known Framework tags

Currently, we support:

- Vuetify >= 3.8.4
- VueUse >= 13.6.0
- Quasar >= 1.16.0
- Nuxt >= 4.2.1
- Naive UI >= 2.43.2
- PrimeVue >= 4.5.3

Other versions might work but are not tested.

If you want to use a framework version that is not yet supported, you can use the importer tools to provide your own list 
of tags.

We are working on more.

### Known Framework tags

Depending on which framework you are using in the project, add the strings to the command line.

``` bash
 npx vue-auto-import-checker -f vuetify vueuse quasar nuxt naiveui primevue
```

## Examples

Lookup the examples in the [cookbook.md](docs/cookbook.md).

## CI/CD Integration

This tool is CI-friendly

- If unknown tags are detected, the CLI will exit with a non-zero status code
- If no issues are found, e.g., no unknown tags are found, it will exit successfully with code `0`.

This allows you to easily break builds when auto-imports are missing.

## Security

See [security.md](docs/security.md) in the docs folder.

## Importers

Use a tag list from the specific version that your project is using by using a specific importer.

Every importer has its own `README.md` file so you can look up your specific use case.

- Vuetify -> [README.md](src/tools/vuetify/README.md)
- VueUse -> [README.md](src/tools/vueuse/README.md)
- Quasar -> [README.md](src/tools/quasar/README.md)
- Nuxt -> [README.md](src/tools/nuxt/README.md)
- Naive UI -> [README.md](src/tools/naiveui/README.md)
- PrimeVue -> [README.md](src/tools/primevue/README.md)

## Contributors

Thanks for the contribution of code, ideas and motivation to:

[![GitHub Profile](https://github.com/marcelwagner.png?size=50)](https://github.com/marcelwagner)
[![GitHub Profile](https://github.com/cnguyen-de.png?size=50)](https://github.com/cnguyen-de)
[![GitHub Profile](https://github.com/mreise.png?size=50)](https://github.com/mreise)

Special thanks to **Matthias** for the idea.

## Feedback & Contributions

If this tool helps you out, consider leaving a star on the repository — it really motivates further development!

Found a bug? Something not working as expected?  
Please open an issue so it can be fixed quickly. 

Missing a feature you’d love to see?  
Feature requests are very welcome as well! 

[![GitHub](https://img.shields.io/badge/GitHub-Repo-blue?logo=github)](https://github.com/marcelwagner/vue-auto-import-checker)

Thanks for helping make **Vue Auto-Import Checker** better for everyone! 🙌