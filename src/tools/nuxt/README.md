# Nuxt Components Importer

## Description

Use the tags from the specific version your project is using by using this importer.

Currently, we support:

- 4.2.1
- 4.2.2
- 4.3.1
- 4.4.2

## Usage

``` bash
 npx vue-auto-import-checker -t nuxt
```

Use the tags from the specific version your project is using by using an importer.

An importer will add a new tag list from your actual framework version so that the checker ignores all tags
from your current implementation.

This will add a `.cache` folder to your `node_modules` directory.

Try using other versions and [report](https://github.com/marcelwagner/vue-auto-import-checker/issues/12) for which
version the importer works.

We are working on more.

### Ignore Framework tags

Depending on which framework you are using in your project, add the strings to the command line.

``` bash
 npx vue-auto-import-checker \
 -c ./tests/data/vue-test-project/components.d.ts \
 -p ./tests/data/vue-test-project/src/ \
 --f nuxt
```
