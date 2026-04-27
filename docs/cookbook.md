# Examples

## Components only:

- Your `components.d.ts` file is located at: \
  `./tests/data/vue-test-project/components.d.ts`
- And you want to see a detailed report of all components that are registered in the file.
- And you want to see a detailed statistical output of the performance of the tool.

```bash
 vue-auto-import-checker \
  -c ./tests/data/vue-test-project/components.d.ts \
  -r \
  -s
```

## Detailed report of unknown components (example 1)

- Your `components.d.ts` file is located at: \
  `./tests/data/vue-test-project/components.d.ts`
- Vue component files are located in: \
  `./tests/data/vue-test-project/src/`
- You are using Vuetify, VueUse, and custom components `ToolingIcon` & `EcosystemIcon`.
- You want to see a detailed report of all unknown components.
- And you want to see a detailed statistical output of the performance of the tool.

```bash
 vue-auto-import-checker \
  -c ./tests/data/vue-test-project/components.d.ts \
  -p ./tests/data/vue-test-project/src/ \
  -f vuetify vueuse \
  -l ToolingIcon EcosystemIcon \
  -r \
  -s
```

## Detailed report of unknown components (example 2)

- Your `components.d.ts` file is located at: \
  `./tests/data/vue-test-project/components.d.ts`
- Vue component files are located in: \
  `./tests/data/vue-test-project/src/`
- You are using Vuetify and custom components `ToolingIcon` & `EcosystemIcon`.
- And you want to see every SVG tag as unknown (which would normally be recognized as known).
- You also have imported components, and you want the tags of those components to be handled as if they were known.
- And you want to see a detailed report of all **unknown** components.
- And you want to see a detailed statistical output of the performance of the tool.

```bash
 vue-auto-import-checker \
  -c ./tests/data/vue-test-project/components.d.ts \
  -p ./tests/data/vue-test-project/src/ \
  -f vuetify \
  -n svg \
  -l ToolingIcon EcosystemIcon \
  -i \
  -r \
  -s
```

## Pipeline example (fail or success)

- Your `components.d.ts` file is located at: \
  `./tests/data/vue-test-project/components.d.ts`
- Vue component files are located in: \
  `./tests/data/vue-test-project/src/`
- You are using Vuetify.
- And you use custom components which you have listed in the file `custom-tags.json`.
- And you only want this tool in your CI workflow to fail or pass.

```bash
 vue-auto-import-checker \
  -c ./tests/data/vue-test-project/components.d.ts \
  -p ./tests/data/vue-test-project/src/ \
  -f vuetify \
  -j ./tests/data/vue-test-project/custom-tags.json
```

## Kafka: Show all tags and a detailed report

- Your `components.d.ts` file is located at: \
  `./tests/data/vue-test-project/components.d.ts`
- Vue component files are located in: \
  `./tests/data/vue-test-project/src/`
- You want to see a detailed report of all **known and unknown** tags.
- And you want to see a detailed statistical output of the performance of the tool.

```bash
 vue-auto-import-checker \
  -c ./tests/data/vue-test-project/components.d.ts \
  -p ./tests/data/vue-test-project/src/ \
  -k \
  -r \
  -s \
```
