# Command options

<!-- TOC -->

- [Config file](#config-file)
- [Components file](#components-file)
- [Project paths](#project-paths)
- [Cache path](#cache-path)
- [Tool](#tool)
- [Known tags](#known-tags)
- [Known tags file](#known-tags-file)
- [Frameworks](#frameworks)
- [Negate known](#negate-known)
- [Imports known](#imports-known)
- [Stats](#stats)
- [Result](#result)
- [Quiet](#quiet)
- [Kafka](#kafka)
- [Output format](#output-format)
- [Debug](#debug)
- [Show config](#show-config)
- [Version](#version)
- [Help](#help)
<!-- TOC -->

## Config file

Path to a config file holding the config for this run.

Command option: `--config-file <file-path>`, `-x` \
Multiple values: `false` \
Default: `''` \
Example:

```sh
npx vue-auto-import-checker --config-file ./vue-aic.config.json
```

## Components file

Path to a file that exports registered components (relative to the current working directory).

Command option: `--components-file <file-path>`, `-c` \
Config option: `componentsFile` \
Multiple values: `false` \
Default: `''` \
Example:

```sh
npx vue-auto-import-checker <options> --components-file ./path/components.ts
```

## Project paths

List of directory paths containing Vue project files to scan (relative to the current working directory).

Command option: `--project-paths [path...]`, `-p` \
Config option: `projectPaths` \
Multiple values: `true` \
Default: `[]` \
Example:

```sh
npx vue-auto-import-checker <options> --project-paths ./path1 ./path2
```

## Cache path

Directory for storing and looking up cached custom known files (relative to the current working directory).

Command option: `--cache-path <cache-path>`, `-a` \
Config option: `cachePath` \
Multiple values: `false` \
Default: `'./node_modules/.cache'` \
Example:

```sh
npx vue-auto-import-checker <options> --cache-path ./.cache
```

## Tool

Run a specific helper tool to generate custom tag lists.

Command option: `--tool <tool>`, `-t` \
Config option: `tool` \
Inherits:

- `components-file` = `''`
- `project-paths` = `''`

Possible values:

- `naiveui`
- `nuxt`
- `primevue`
- `quasar`
- `vuetify`
- `vueuse`

Multiple values: `false` \
Default: `''` \
Example:

```sh
npx vue-auto-import-checker --tool vuetify
```

## Known tags

List of custom component tags to treat as known.

Command option: `--known-tags [tags...]`, `-l` \
Config option: `knownTags` \
Multiple values: `true` \
Default: `[]` \
Example:

```sh
npx vue-auto-import-checker <options> --known-tags tag1 tag2
```

## Known tags file

Path to a JSON file containing a list of component tags to treat as known.

Command option: `--known-tags-file <file-path>`, `-j` \
Config option: `knownTagsFile` \
Multiple values: `false` \
Default: `''` \
Example:

```sh
npx vue-auto-import-checker <options> --known-tags-file ./known-tags.json
```

## Frameworks

Treat predefined framework tag sets as known.

Command option: `--frameworks [frameworks...]`, `-f` \
Config option: `frameworks` \
Possible values:

- `naiveui`
- `nuxt`
- `primevue`
- `quasar`
- `vuetify`
- `vueuse`

Multiple values: `true` \
Default: `[]` \
Example:

```sh
npx vue-auto-import-checker <options> --frameworks nuxt vuetify
```

## Negate known

Explicitly treat tag sets as unknown.

Command option: `--negate-known [sets...]`, `-n` \
Config option: `negateKnown` \
Possible values:

- `html`
- `svg`
- `vue`
- `vuerouter`
- Multiple values: `true` \
  Default: `[]` \
  Example:

```sh
npx vue-auto-import-checker <options> --negate-known html svg
```

## Imports known

Treat tags that match imported components as known.

Command option: `--imports-known`, `-i` \
Config option: `importsKnown` \
Default: `false` \
Example:

```sh
npx vue-auto-import-checker <options> --imports-known
```

## Stats

Output aggregated scan statistics.

Command option: `--stats`, `-s` \
Config option: `showStats` \
Inherits: `quiet` = `false` \
Default: `false` \
Example:

```sh
npx vue-auto-import-checker <options> --stats
```

## Result

Output detailed result entries for each found tag.

Command option: `--result`, `-r` \
Config option: `showResult` \
Inherits: `quiet` = `false` \
Default: `false` \
Example:

```sh
npx vue-auto-import-checker <options> --result
```

## Quiet

Suppress all standard output.

Command option: `--quiet`, `-q` \
Config option: `quiet` \
Inherits:

- `stats` = `false`
- `result` = `false`
- `debug` = `false`
- `outputFormat` = `'text'`

Default: `false` \
Example:

```sh
npx vue-auto-import-checker <options> --quiet
```

## Kafka

Output each found tag with its framework and recognition status.

Command option: `--kafka`, `-k` \
Config option: `kafka` \
Default: `false` \
Example:

```sh
npx vue-auto-import-checker <options> --kafka
```

## Output format

Choose between plain text, `md` (Markdown), and `json` output.

Command option: `--output-format <output-format>`, `-o` \
Config option: `outputFormat` \
Possible values:

- `md`
- `json`
- `text`

Multiple values: `false` \
Default: `'text'` \
Example:

```sh
npx vue-auto-import-checker <options> --output-format json
```

## Debug

Enable detailed debug logging.

Command option: `--debug`, `-d` \
Config option: `debug` \
Inherits: `quiet` = `false` & `outputFormat` = `'text'` \
ENV: `DEBUG` \
Default: `false` \
Examples:

```sh
npx vue-auto-import-checker <options> --debug
```

```sh
DEBUG=true npx vue-auto-import-checker <options>
```

## Show config

Show the current configuration.

Command option: `--show-config`, `-y` \
Config option: `showConfig` \
Default: `false` \
Example:

```sh
npx vue-auto-import-checker <options> --show-config
```

## Version

Output the current version.

Command option: `--version`, `-v` \
Default: `false` \
Example:

```sh
npx vue-auto-import-checker --version
```

## Help

Display help information.

Command option: `--help`, `-h` \
Default: `false` \
Example:

```sh
npx vue-auto-import-checker --help
```
