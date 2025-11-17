# Vue unplugin checker

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Check via cli whether the Vue unplugin has every tag in your template registered. Currently ignoring all html and vuetify@3.10.11 tags.

# Dependencies

At this time we recommend using

- Node.js >=23.5.0*

*\* See usage for more info about node <= 23.4.0*

# Install

``` bash
 nvm use
 npm install
```

# Usage

``` bash
 npx vue-unplugin-checker -h
```

If your local version of node is <=23.4.0 you can also use

``` bash
 tsx cli.ts -h
```

## Options

- -v or --version
- -s or --stats                   print stats after check (default: false)
- -r or --result                  print result after check (default: false)
- -q or --quiet                   suppress output (default: false)
- -c or --components-file <file>  write the file name or path to the file (relative to the current working directory) (default: "./components.d.ts")
- -p or --project-path <path>     path to the vue project files to look for vue components (relative to the current working directory) (default: "")
- -h or --help                    display help for command