# Vue auto-import checker

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Check via cli whether vue unplugin has every tag in your template registered. Currently ignoring all html and vuetify@3.10.11 tags.

# Dependencies

At this time we recommend using

- Node.js >=23.5.0*

*\* See usage for more info about node <= 23.4.0*

# Install

``` bash
 npm install
```

# Usage

``` bash
 npx vue-auto-import-checker -h
```

If your local version of node is <=23.4.0 you can also use

``` bash
 tsx cli.ts -h
```

## Options

- -c --components-file <file>  write the file name or path to the file (relative to the current working directory) (default: "./components.d.ts")
- -p --project-path <path>     path to the vue project files to look for vue components (relative to the current working directory) (default: "")
- -s --stats                   print stats after check (default: false)
- -r --result                  print result after check (default: false)
- -q --quiet                   suppress output (default: false)
- --tags [tags...]             ignore these tags (default: [])
- --vuetify                    ignore vuetify tags (default: false)
- --html                       ignore html tags (default: true)
- -v, --version                output the current version
- -h, --help                   display help for command