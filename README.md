# Vue auto-import checker

npm: [vue-auto-import-checker](https://www.npmjs.com/package/vue-auto-import-checker)

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) [![npm version](https://img.shields.io/npm/v/vue-auto-import-checker.svg)](https://www.npmjs.com/package/vue-auto-import-checker) [![GitHub](https://img.shields.io/badge/GitHub-Repo-blue?logo=github)](https://github.com/marcelwagner/vue-auto-import-checker) [![npm downloads](https://img.shields.io/npm/dm/vue-auto-import-checker.svg)](https://www.npmjs.com/package/vue-auto-import-checker) ![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/vue-auto-import-checker)

<!-- TOC -->

- [Description](#description)
- [Why?](#why)
- [Node](#node)
- [Vue](#vue)
- [Installation](#installation)
- [Usage](#usage)
- [Known Frameworks](#known-frameworks)
- [CI/CD Integration](#cicd-integration)
- [Security](#security)
- [Importers](#importers)
- [Contributors](#contributors)
- [Feedback & Contributions](#feedback--contributions)

<!-- TOC -->

## Description

Sometimes your vue-Repo is a mess, especially if you have a large (mono)repo, and you switch, mid-development to
[unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) (or similar auto-import setups).
This CLI tool checks if every component tag used in your Vue templates is properly registered in `components.d.ts`.

You can configure which tag sets the checker should handle as if they were known, like `Vuetify`, `VueUse`, `Quasar`,
`Nuxt`, `Naive UI` or `PrimeVue` (as it is described in the secion [Known Frameworks](#known-frameworks)). `HTML`, `Vue`, `VueRouter`,
and `SVG` tags are known by default, but you can remove them from the known list if needed.

It is also possible to provide your own list of known tags by providing a `custom-tags-file` in JSON format or a simple
list of tags (as it is described on [command-options](docs/command-options.md)).

## Why?

Why does this tool exist?

Because of migration from older codebases and toolsets to modern ones, especially in larger (mono)repos.

My experience as a developer showed me that the decision to use the top end toolset does come one day and then the
migration is oftentimes not a recommendation from the customer, but from the developer team. That means the migration
is not paid work. So it is not made as a priority.
Using something like the unplugin for your vue project is recommended. But the migration is not always easy. You have to
change your codebase, and you have to make sure that you do not forget any tags. This tool helps you with that. It
checks your codebase for unknown tags and tells you where they are. So you can find and fix them.

## Node

We recommend using:

- Latest Node.js 24.x LTS (minimum required 20.19.1)

Other versions might work but are not tested.

## Vue

The supported Vue files should use Single-File Components (also known as \*.vue files, abbreviated as SFC).
That means the tool is assuming to have files in your project path that are looking like this:

```vue
<script>
/* Typescript or Javascript content */
</script>

<template>
  <!-- HTML content -->
</template>

<style>
/* CSS content */
</style>
```

The tool also assumes to have at minimum the `template` section in your files.

## Installation

Use the package as a globally installed CLI tool (for example for multiple projects).

```sh
 npm i vue-auto-import-checker -g
```

Use the package as a locally installed dev-dependency (for example in the ci/cd pipeline).

```sh
 npm i vue-auto-import-checker -D
```

## Usage

To use the package without installation.

```sh
 npx vue-auto-import-checker <options>
```

Use the implemented help to display all the options:

```sh
 npx vue-auto-import-checker -h
```

It is possible to use a [config-file](docs/config-file.md) with all your [command-options](docs/command-options.md).

Lookup the [command-options](docs/command-options.md).

But you can also start with an example from our [cookbook](docs/cookbook.md).

## Known Frameworks

Currently, we support:

- Vuetify >= 3.8.4
- VueUse >= 13.6.0
- Quasar >= 1.16.0
- Nuxt >= 4.2.1
- Naive UI >= 2.43.2
- PrimeVue >= 4.5.3

Other versions might work but are not tested.

If you want to use a framework version that is not yet supported, you can use the importer tools to provide your own
list of tags.

We are working on more.

## CI/CD Integration

This tool is CI-friendly

- If unknown tags are detected, the CLI will exit with a non-zero status code (if the --output-format text is configured)
- If no unknown tags are found, it will exit successfully with code `0`.

This allows you to easily break builds when auto-imports are missing.

## Security

Look into the file [security](docs/security.md) in the docs folder.

## Importers

Use a tag list from the specific version that your project is using by using a specific importer.

Every importer has its own explanation file so you can look up your specific use case.

- [Vuetify](docs/tools/vuetify.md)
- [VueUse](docs/tools/vueuse.md)
- [Quasar](docs/tools/quasar.md)
- [Nuxt](docs/tools/nuxt.md)
- [Naive UI](docs/tools/naiveui.md)
- [PrimeVue](docs/tools/primevue.md)

## Contributors

Thanks for the contribution of code, ideas and motivation to:

[![GitHub Profile](https://github.com/marcelwagner.png?size=50)](https://github.com/marcelwagner)
[![GitHub Profile](https://github.com/cnguyen-de.png?size=50)](https://github.com/cnguyen-de)
[![GitHub Profile](https://github.com/mreise.png?size=50)](https://github.com/mreise)

Thanks to **Matthias** for the idea.

Spezial thanks to my family, to my wife Jiyeop and to my son Ryan.

## Feedback & Contributions

If this tool helps you out, consider leaving a star on the repository — it really motivates further development!

Found a bug? Something not working as expected?  
Please open an [issue](https://github.com/marcelwagner/vue-auto-import-checker/issues) so it can be fixed quickly.

Missing a feature you’d love to see?  
Feature requests are very welcome as well!

Thanks for helping make **Vue Auto-Import Checker** better for everyone! 🙌
