# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2026-04-12

### Added
- workflows.md to describe how to use this tool in github actions

### Changed
- Node version 24 LTS
- Updated the github workflows file to automatically use Node version 20.19 and 24.x

## [1.1.0] - 2026-04-09

### Changed
- cli option "--project-path" is now "--project-paths" and will be a list of paths
- backward compatibility for the cli option "project-path" is only if "-p" was used

## [1.0.5] - 2026-03-31

### Added
- Added support for Vuetify 4.0.4
- Added support to readme-file for naive-ui 2.44.1
- Added Vuetify directive-tags
- Added Vuetify transition-tags
- Added support for directives and transitions in Vuetify importer tool

## [1.0.4] - 2026-03-22

### Fixed
- Dev dependencies have no vulnerabilities anymore

### Added
- Support more implemented components from Vue: 
  - Transition
  - TransitionGroup
  - KeepAlive
  - Teleport

## [1.0.3] - 2026-03-20

### Fixed
- Fix for error if a certain import is found

## [1.0.2] - 2026-03-17

### Fixed
- Fixes for some README.md files and the security.md file.

## [1.0.1] - 2026-03-15

### Fixed
- Frameworks are dev dependencies again, so they do not install into production builds.

## [1.0.0] - 2026-03-14

### Added
- Support for newer versions of frameworks:
  - Nuxt >= 4.2.1 (added 4.2.2, 4.3.1, 4.4.2)
  - PrimeVue >= 4.5.3 (added 4.5.4)
  - Vuetify >= 3.8.4 (added 3.11.3, 4.0.1)
  - VueUse >= 13.6.0 (added 14.1.0, 14.2.1)
  - Quasar >= 1.16.0 (added 2.18.6)
- New `--kafka` option to output each found tag with its framework and recognition status.
- New `--imports-known` option to output found tag which are imported components as known tags.
- Added js files to use JavaScript instead of TypeScript.
- Added lots of tests for the CLI and tools.
- Added `CHANGELOG.md` file.
- Added a `cookbook.md` file for more detailed examples.
- Added a `security.md` file for security vulnerabilities.

### Changed
- Changed the executor of the cli from `tsx` to `node`.
- Recommended Node.js version updated to >= 24.11.1 (minimum required 20.19.1).
- Improved CLI statistics output and descriptions.
- Refactored type hints across the project for a better development experience.
- Renamed internal configuration and moved paths for a better project structure.

### Fixed
- Fixed spelling, grammar, and phrasing in all documentation (README, cookbook, tools) and CLI descriptions for better professional consistency.
- Corrected terminology (e.g., "tag sets") and capitalization in help outputs.

## [0.12.0] - 2025-12-07

### Added
- Added Nuxt tags list and importer.
- Added CLI tests.

### Fixed
- Fixed a bug that prevented importers from running.

## [0.11.0] - 2025-12-04

### Added
- Added `winston` as logger.
- Added contributors to README.

### Changed
- Code optimizations.

## [0.10.1] - 2025-12-02

### Added
- Added Quasar to README.

### Changed
- Workflow name change.

## [0.10.0] - 2025-12-01

### Added
- Added Quasar component tags as ignore list and Quasar importer.
- New contributor Chi Nguyen in `package.json`.

### Fixed
- Fix for not being able to disable Vuetify & VueUse ignore lists.

### Changed
- Improvements for README.

## [0.9.2] - 2025-11-29

### Added
- GitHub Workflow action: on push, run lint, typecheck, and tests.
- Testing on Node.js 20.19, 22.15, 22.18, 24.0, and 24.11.

## [0.9.1] - 2025-11-29

### Fixed
- Fixed `vueRouter` being ignored by default.
- Fixed path problem if no path is provided.

## [0.9.0] - 2025-11-29

### Added
- Added ability to load a file with tags to ignore (`--known-tags-file`).
- Added documentation and refactored `README.md`.

### Changed
- Refactoring.

## [0.8.0] - 2025-11-28

### Added
- Added tests.

### Changed
- Huge update!
- Improvement for the tag search algorithm.
- Fragmentation of code.

## [0.7.5] - 2025-11-25

### Fixed
- Security fixes.

## [0.7.4] - 2025-11-25

### Changed
- Tools paths refactoring.

## [0.7.3] - 2025-11-25

### Changed
- Tag search refactoring: Ignoring Types in template event properties and template properties.

## [0.7.2] - 2025-11-25

### Changed
- Improved tag search.

## [0.7.1] - 2025-11-25

### Fixed
- Fix for release 0.7.0 and paths.

## [0.7.0] - 2025-11-21

### Added
- Tag search refactoring: Ignoring links in comments and Types in template event handlers.
- Results & Stats output refactoring.

## [0.6.2] - 2025-11-21

### Fixed
- Fix for multiple minus characters in ignore tags.

## [0.6.1] - 2025-11-21

### Changed
- Pattern improvements for tag search: Now ignoring `Type` and `any` as tags.

## [0.6.0] - 2025-11-20

### Added
- Added support for `vueuse`, `vue`, `vue-router`, and `svg` as ignore sets.
- New `vueuse-importer` tool.

### Changed
- Improvements of regex patterns to find typings inside `eventProperties`.

## [0.5.0] - 2025-11-20

### Added
- New `vuetify-importer` tool to create a local Vuetify tag list.
- Out-of-the-box support for Vuetify version 3.8.3.

## [0.4.4] - 2025-11-20

### Changed
- CustomTags refactoring: formatting tags from camelCase & snake_case to lowercase.
- CLI option `tags` renamed to `customtags`.
- Config interface `tags` param renamed to `customTags`.
- Huge `README.md` update.

## [0.4.3] - 2025-11-19

### Changed
- Local publishing of package to npm.

## [0.4.0] - 2025-11-19

### Added
- Added options to CLI & `getUnknownTags`: `html`, `vuetify`, `tags`.
- Optimized result output.
- Preparations for publishing to npm.

## [0.3.2] - 2025-11-18

### Added
- First release of the tool!
