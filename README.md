# Vue auto-import checker

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT) [![npm version](https://img.shields.io/npm/v/vue-auto-import-checker.svg)](https://www.npmjs.com/package/vue-auto-import-checker) [![npm downloads](https://img.shields.io/npm/dm/vue-auto-import-checker.svg)](https://www.npmjs.com/package/vue-auto-import-checker) 

A CLI tool that checks whether every non-HTML tag used in your Vue templates is properly registered in `components.d.ts 
when using unplugin-vue-components (or similar auto-import setups).

You can configure the checker to:

- Ignore standard HTML tags (default: true)
- Ignore Vuetify component tags (currently v3.10.11)
- Ignore any additional custom tags you specify

# Requirements

We recommend using:

- Node.js >= 23.5.0

\*See the *Usage* section for a workaround on Node.js <= 23.4.0.

# Installation

``` bash
 npm i vue-auto-import-checker
```

# Usage

``` bash
 npx vue-auto-import-checker -h
```

If you're running **Node.js <= 23.4.0**, you can use:

``` bash
 tsx cli.ts -h
```

## Example

Assume:
- Your `components.d.ts` file lives at: \
`./tests/data/vue-test-project/components.d.ts`
- Vue component files are located in: \
`./tests/data/vue-test-project/src/`
- You are using Vuetify and a custom component named `ToolingIcon

``` bash
 npx vue-auto-import-checker \
  -c ./tests/data/vue-test-project/components.d.ts \
  -p ./tests/data/vue-test-project/src/ \
  --vuetify \
  --customtags toolingicon \
  -r \
  -s
```

## Options

| Option                         | Alias | Description                                                                 | Default              |
|--------------------------------|-------|-----------------------------------------------------------------------------|----------------------|
| `--components-file <file>`     | `-c`  | Path to the `components.d.ts` file (relative to CWD)                        | `./components.d.ts`  |
| `--project-path <path>`        | `-p`  | Path to the Vue source directory (relative to CWD)                          | `""`                 |
| `--stats`                      | `-s`  | Print a summary of the check                                                | `false`              |
| `--result`                     | `-r`  | Print detailed results                                                      | `false`              |
| `--quiet`                      | `-q`  | Suppress all output                                                         | `false`              |
| `--customtags [customtags...]` | —     | Ignore these component tags                                                 | `[]`                 |
| `--vuetify`                    | —     | Ignore Vuetify component tags                                               | `false`              |
| `--html`                       | —     | Ignore HTML element tags                                                    | `true`               |
| `--version`                    | `-v`  | Show the currently installed version                                        | —                    |
| `--help`                       | `-h`  | Display help information                                                    | —                    |

## Feedback & Contributions

If this tool helps you out, consider leaving a star on the repository — it really motivates further development!

Found a bug? Something not working as expected?  
Please open an issue on so it can be fixed quickly.

Missing a feature you’d love to see?  
Feature requests are very welcome as well!

[![GitHub](https://img.shields.io/badge/GitHub-Repo-blue?logo=github)](https://github.com/marcelwagner/vue-auto-import-checker)

Thanks for helping make **Vue Auto-Import Checker** better for everyone! 🙌