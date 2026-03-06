# Examples

## 1. Example:

``` bash
 npx vue-auto-import-checker \
  -c ./tests/data/vue-test-project/components.d.ts \
  -p ./tests/data/vue-test-project/src/ \
  -f vuetify vueuse \
```

## 2. Example

- Your `components.d.ts` file lives at: \
  `./tests/data/vue-test-project/components.d.ts`
- Vue component files are located in: \
  `./tests/data/vue-test-project/src/`
- You are using Vuetify, VueUse and a custom component named `ToolingIcon`
- And you want to see a report and a statistical output

``` bash
 npx vue-auto-import-checker \
  -c ./tests/data/vue-test-project/components.d.ts \
  -p ./tests/data/vue-test-project/src/ \
  -f vuetify vueuse \
  -l ToolingIcon EcosystemIcon \
  -r \
  -s
```

## 3. Example

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

## 4. Example

- Your `components.d.ts` file lives at: \
  `./tests/data/vue-test-project/components.d.ts`
- And you only want a list of all tags the components.d.ts file is providing

``` bash
 npx vue-auto-import-checker -c ./tests/data/vue-test-project/components.d.ts
```