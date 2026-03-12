# Examples

## Components only:
- Your `components.d.ts` file lives at: \
  `./tests/data/vue-test-project/components.d.ts`
- And you want to see a detailed report of all components that are registered in the file
- And you want to see a detailed statistical output of the performance of the tool

``` bash
 npx vue-auto-import-checker \
  -c ./tests/data/vue-test-project/components.d.ts \
  -r \
  -s
```

## Detailed report of unknown components

- Your `components.d.ts` file lives at: \
  `./tests/data/vue-test-project/components.d.ts`
- Vue component files are located in: \
  `./tests/data/vue-test-project/src/`
- You are using Vuetify, VueUse and custom components `ToolingIcon` & `EcosystemIcon`
- And you want to see a detailed report of all unknown components
- And you want to see a detailed statistical output of the performance of the tool

``` bash
 npx vue-auto-import-checker \
  -c ./tests/data/vue-test-project/components.d.ts \
  -p ./tests/data/vue-test-project/src/ \
  -f vuetify vueuse \
  -l ToolingIcon EcosystemIcon \
  -r \
  -s
```

## Pipeline example (fail or success)

- Your `components.d.ts` file lives at: \
  `./tests/data/vue-test-project/components.d.ts`
- Vue component files are located in: \
  `./tests/data/vue-test-project/src/`
- You are using Vuetify
- And you use custom component which you list in the file custom-tags.json
- And you only want to have this tool in your CI workflow to fail or pass

``` bash
 npx vue-auto-import-checker \
  -c ./tests/data/vue-test-project/components.d.ts \
  -p ./tests/data/vue-test-project/src/ \
  -f vuetify \
  -j ./tests/data/vue-test-project/custom-tags.json
```

## Kafka: Show all tags and a detailed report

- Your `components.d.ts` file lives at: \
  `./tests/data/vue-test-project/components.d.ts`
- Vue component files are located in: \
  `./tests/data/vue-test-project/src/`
- You are using Vuetify
- And you use custom component which you list in the file custom-tags.json
- And you only want to have this tool in your CI workflow to fail or pass
- And you want to see a detailed report of all tags
- And you want to see a detailed statistical output of the performance of the tool

``` bash
 npx vue-auto-import-checker \
  -c ./tests/data/vue-test-project/components.d.ts \
  -p ./tests/data/vue-test-project/src/ \
  -f vuetify \
  -k \
  -r \
  -s \
```